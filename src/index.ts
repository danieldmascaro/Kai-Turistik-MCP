import { app } from '@azure/functions';
import "./functions/Kai_turismo_parque.js";

app.setup({
    enableHttpStream: true,
});
