import { app, HttpRequest, type HttpResponseInit, InvocationContext } from "@azure/functions";
import "dotenv/config";
import { triageAgentTurismo } from "../tour_agents/tour_agents.js";
import { triageAgentCerro } from "../parquemet_agents/parquemet_agents.js";
import {
  run,
  InputGuardrailTripwireTriggered,
} from "@openai/agents";
import { comandoSaludoHandler } from "../prompting/helpers/saludos.js";
import { armarPromptParaAgente, guardarInteraccion, borrarMemoriaUID, getAreaNegocio } from "../helpers/user_config/user_settings.js";
import { closePool } from "../helpers/db_helpers/db.js";
import type { AreaNegocio } from "../prompting/types.js";
import { string_fecha_hora } from "../prompting/helpers/fecha.js";

export async function Kai_turismo_parque(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        body = undefined;
    }

    const uid = request.query.get("uid") || (body as { uid?: string } | undefined)?.uid || "";
    const mensaje = request.query.get("mensaje") || (body as { mensaje?: string } | undefined)?.mensaje || "";

    let areaNegocio = await getAreaNegocio(uid) as AreaNegocio;
    let reiniciosArea = 0;
    const maxReiniciosArea = 3;

    try {
        while (true) {
            try {
                if (mensaje.trim() === "#Reiniciar") {
                    await borrarMemoriaUID(uid);
                    return { body: `Memoria reiniciada para el usuario: ${uid}` };
                } else if (mensaje.trim().startsWith("#SaludoKaiV2")) {
                    await comandoSaludoHandler(mensaje, uid, string_fecha_hora, areaNegocio);
                    return { body: "" };
                }

                const promptArmado = await armarPromptParaAgente({
                    uid,
                    mensaje_usuario: mensaje,
                    area_negocio: areaNegocio,
                });
                let result;
                if (areaNegocio === "Turismo") {
                    result = await run(triageAgentTurismo, promptArmado, {
                        context: { userId: uid, userPrompt: mensaje, areaNegocio },
                    });
                } else if (areaNegocio === "ParqueMet") {
                    result = await run(triageAgentCerro, promptArmado, {
                        context: { userId: uid, userPrompt: mensaje, areaNegocio },
                    });
                }

                const respuestaBot = String(result?.finalOutput);
                await guardarInteraccion({
                    uid,
                    mensaje_usuario: mensaje,
                    mensaje_bot: respuestaBot,
                    string_fecha_hora,
                    areaNegocio: areaNegocio,
                });
                return { body: respuestaBot };
            } catch (e) {
                if (e instanceof InputGuardrailTripwireTriggered) {
                    const outputInfo = e.result?.output?.outputInfo as { reason?: string } | undefined;
                    if (outputInfo?.reason === "AREA_CHANGE") {
                        reiniciosArea += 1;
                        if (reiniciosArea > maxReiniciosArea) {
                            return { body: "No se pudo estabilizar el area de negocio, intenta nuevamente." };
                        }
                        areaNegocio = await getAreaNegocio(uid) as AreaNegocio;
                        continue;
                    }
                    return { body: "Hola, soy Kai. Puedo ayudarte con solicitudes relacionadas a Turistik." };
                }
                throw e;
            }
        }
    } finally {
        try {
            await closePool();
        } catch (err) {
            context.error("No se pudo cerrar el pool SQL:", err);
        }
    }
};

app.http('Kai_turismo_parque', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: Kai_turismo_parque
});
