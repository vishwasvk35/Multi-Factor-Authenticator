import { Check, X } from "lucide-react";

function PassworkChecker(props) {
  const password = props.password;

  const constraints = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letters", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letters", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /[0-9]/.test(password) },
    {
      label: "Contains a special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div>
      {constraints.map((items) => {
        return (
          <div className="flex gap-3" key={items.label}>
            <p>{items.met ? <Check className="text-blue-400"/> : <X className="text-gray-800" />}</p>
            <p>{items.label}</p>
          </div>
        );
      })}
    </div>
  );
}

export default PassworkChecker;
