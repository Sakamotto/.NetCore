import { RedeSocial } from './RedeSocial';
import { Evento } from './Evento';

export interface Palestrante {
    id: number;
    nome: string;
    miniCurriculo: string;
    imagemURL: string;
    telefone: string;
    email: string;
    redesSociais: Array<RedeSocial>;
    palestrantesEventos: Array<Evento>;
}
