export abstract class IframeMessage {
    public abstract action: string;

    protected constructor(public payload: object) {}
}
