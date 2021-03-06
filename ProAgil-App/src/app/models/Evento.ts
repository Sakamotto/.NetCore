import { Lote } from './Lote';
import { Palestrante } from './Palestrante';
import { RedeSocial } from './RedeSocial';

export class Evento {

  constructor() { }

    id: number;
    local: string;
    dataEvento: Date;
    tema: string;
    qtdPessoas: number;
    imagemURL: string;
    telefone: string;
    email: string;
    lotes: Array<Lote>;
    redesSociais: Array<RedeSocial>;
    palestranteEventos: Array<Palestrante>;
}
