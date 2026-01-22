# Agentes Turistik (agents/)

## Descripcion general

Esta carpeta contiene la capa de **agentes LLM** que orquesta prompts, memoria y conexion con el servidor MCP. El foco es enrutar solicitudes al agente correcto y mantener contexto persistente usando SQL.

Desplegado a Azure Functions

---

## Estructura rapida

- `src/main.ts`: entrada local; lee prompt por consola, arma contexto y ejecuta el agente.
- `src/tour_agents/`: agentes del dominio Turismo.
- `src/parquemet_agents/`: agentes del dominio ParqueMet.
- `src/prompting/`: helpers para prompts, saludos y fechas.
- `src/helpers/`: persistencia y helpers de SQL.

---

## Requisitos

- Node.js + npm
- API key de OpenAI
- Acceso a SQL Server (para memoria y perfil de usuario)

---

## Scripts disponibles

```bash
npm run dev    # Ejecuta el agente local por consola
npm test       # Placeholder
```

---

## Ejecutar en local

Desde esta carpeta:

```bash
npm install
npm run dev
```

El script pedira un prompt por consola y ejecutara el agente segun el area de negocio actual.

---

## Variables de entorno

Se espera un archivo `.env` con estas claves (sin valores hardcodeados):

```
OPENAI_API_KEY
SQL_SERVER
SQL_DATABASE
SQL_USER
SQL_SECRET
```

---

## SQL (memoria y perfil)

`src/helpers/user_config/user_settings.ts` maneja:
- `ia.usuario_web` (perfil y area de negocio)
- `ia.memoria_persistente` (historial)
- `ia.memoria_corta` (contexto corto)

`src/prompting/helpers/registro_logs.ts` registra eventos en `ia.kai2_logs`.

---

## Notas

- Los agentes consultan tools del MCP cuando corresponde; si usas Ngrok o un endpoint remoto, valida el link configurado en los agentes.
- Este README sigue la linea del README general, enfocado en la carpeta `agents/`.
