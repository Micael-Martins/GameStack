export interface RawgJogo {
    id: number;
    name: string;
    background_image: string | null;
    released: string | null;
    playtime: number;
    genres: { name: string }[];
    platforms: { platform: { name: string } }[] | null;
    developers?: { name: string }[]; // só vem no detalhe (/games/{id})
}