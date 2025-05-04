interface ContextParams {
    font: string;
}

function Context($p: ContextParams): CanvasRenderingContext2D {
    const el: HTMLCanvasElement = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D | null = el.getContext("2d");

    if (!ctx) {
        throw new Error("Could not get 2D context from canvas element");
    }

    ctx.font = $p.font;
    return ctx;
}

export default Context;
