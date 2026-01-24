import { ShoppingCart, Home, Car, Utensils, Film, DollarSign, Target, Wallet, Tag, HelpCircle, Mail, FileText } from "lucide-react"

export const settingsCategories = [
    {
        title: 'Tài chính',
        items: [
            { id: 'expenses', name: 'Quản lý chi phí', icon: DollarSign, badge: null },
            { id: 'budgets', name: 'Ví', icon: Wallet, badge: null },
        ]
    },
    {
        title: 'Hỗ trợ',
        items: [
            { id: 'help', name: 'Trung tâm trợ giúp', icon: HelpCircle, badge: null },
            { id: 'feedback', name: 'Góp ý & Phản hồi', icon: Mail, badge: null },
        ]
    }
];

export const ExpensesCategories = [
  { id: "shopping", name: "Mua sắm", icon: ShoppingCart, color: "from-blue-500 to-blue-600", },
  { id: "housing", name: "Nhà ở", icon: Home, color: "from-purple-500 to-purple-600" },
  { id: "food", name: "Ăn uống", icon: Utensils, color: "from-orange-500 to-orange-600" },
  { id: "transport", name: "Di chuyển", icon: Car, color: "from-green-500 to-green-600" },
  { id: "entertainment", name: "Giải trí", icon: Film, color: "from-red-500 to-red-600" },
]

export const salesData = [
    { month: "T.1", TN: 4000, CT: 2400, TK: 2210 },
    { month: "T.2", TN: 0, CT: 0, TK: 0 },
    { month: "T.3", TN: 0, CT: 0, TK: 0 },
    { month: "T.4", TN: 0, CT: 0, TK: 0 },
    { month: "T.5", TN: 0, CT: 0, TK: 0 },
    { month: "T.6", TN: 0, CT: 0, TK: 0 },
    { month: "T.7", TN: 0, CT: 0, TK: 0 },
    { month: "T.8", TN: 0, CT: 0, TK: 0 },
    { month: "T.9", TN: 0, CT: 0, TK: 0 },
    { month: "T.10", TN: 0, CT: 0, TK: 0 },
    { month: "T.11", TN: 0, CT: 0, TK: 0 },
    { month: "T.12", TN: 0, CT: 0, TK: 0 },
];
