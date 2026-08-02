"use client";

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  label?: string;
  description?: string;
}

export default function ToggleSwitch({
  enabled,
  onChange,
  size = "md",
  disabled = false,
  label,
  description,
}: ToggleSwitchProps) {
  const sizeClasses = {
    sm: {
      track: "w-9 h-5",
      knob: "w-4 h-4",
      translate: "translate-x-[18px]",
    },
    md: {
      track: "w-12 h-7",
      knob: "w-5 h-5",
      translate: "translate-x-[24px]",
    },
    lg: {
      track: "w-16 h-9",
      knob: "w-7 h-7",
      translate: "translate-x-[30px]",
    },
  };

  const sizes = sizeClasses[size];

  const handleToggle = () => {
    if (!disabled) {
      onChange(!enabled);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`
          relative inline-flex items-center rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2
          focus:ring-indigo-500
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${enabled ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"}
          ${sizes.track}
        `}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`
            inline-block rounded-full bg-white shadow-md
            transform transition-transform duration-200 ease-in-out
            ${sizes.knob}
            ${enabled ? sizes.translate : "translate-x-[3px]"}
          `}
        />
      </button>
      
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}