export type CardItem = {
    id: string;
    name: string;
    cardNumber: string;
    bank: string;
    cardType: "credit" | "debit";
    expiry: string;
    cvv: string;
};

export type CardFormState = {
    name: string;
    cardNumber: string;
    bank: string;
    bankOther: string;
    cardType: "credit" | "debit";
    expiry: string;
    cvv: string;
};
