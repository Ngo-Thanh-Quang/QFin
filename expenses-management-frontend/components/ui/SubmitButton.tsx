"use client";

type SubmitButtonProps = {
    loading: boolean;
    onClick: () => void;
    label: string;
    loadingLabel?: string;
};

export default function SubmitButton({
    loading,
    onClick,
    label,
    loadingLabel,
}: SubmitButtonProps) {
    return (
        <button
            type="submit"
            onClick={onClick}
            disabled={loading}
            className={`
        w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl 
        font-semibold shadow-lg flex items-center justify-center space-x-2
        transition-all duration-300
        ${loading ? "opacity-70 cursor-wait" : "hover:shadow-xl hover:scale-105"}
      `}
        >
            <span>{loading ? loadingLabel || label : label}</span>
        </button>
    );
}
