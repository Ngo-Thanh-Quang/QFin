export type TimeState = {
    hour: number
    minute: number
}

export type AddExpenseModalProps = {
    open: boolean
    onClose: () => void
    onNext?: (payload: { date: string; time: string }) => void
    onNotify?: (payload: { type: "success" | "error"; message: string }) => void
    onCreated?: () => void
}
