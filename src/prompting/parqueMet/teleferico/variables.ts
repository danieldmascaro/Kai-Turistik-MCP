import { reglasBase, reglasComunesAgentes } from "../../common/system_prompt.js";
import { promptBase } from "../agentePrincipal/variables.js";

// Común teleférico funicular

const reglasFuniTele = reglasBase + "\n" + reglasComunesAgentes + `\n-Por defecto debes ofrecer el ticket Vive El Parque, a menos que te especifiquen directamente otro ticket. **Siempre debes buscar primero el precio del ticket, y luego consultar por su disponibilidad**`;

// Prompt agente teleférico

const link_compra = "https://telefericosantiago.cl/choose-your-ticket/";

const promptTeleferico = promptBase + `
Tu tarea es proporcionar información detallada sobre los tours Hop-On Hop-Off.
`.trim();

const reglasTeleferico = reglasFuniTele + "\n" + reglasComunesAgentes + "\n-Debes ser capaz de sacar fechas con frases tipo, en una semana más, o el próximo martes, calculando la cantidad de días.";

const comoLlegarTeleferico = `Para llegar al teleférico debes tomar el metro por la línea 1, y bajar en Pedro de Valdivia. Desde la estación Pedro de Valdivia del Metro de Santiago, solo debes caminar 
por Avenida Pedro de Valdivia Norte, cruzando Avenida Andrés Bello, Avenida Santa María y Avenida Los Conquistadores, hasta llegar a Avenida El Cerro, donde encontrarás la entrada al Parque 
Metropolitano y la Estación Oasis.
Estacionamientos disponibles a pasos de la entrada del parque en Av. El Cerro 750, Providencia y en Av. El Cerro esquina Carlos Casanueva, Providencia.
Los estacionamientos son con propina voluntaria al cuidador.

Si el usuario por la ubicación de cosas que no salen en tu prompt, envía el link del mapa del cerro.`;

export {
    link_compra,
    promptTeleferico,
    reglasTeleferico,
    comoLlegarTeleferico,
};
