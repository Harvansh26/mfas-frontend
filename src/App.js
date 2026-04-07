import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [currentOTP, setCurrentOTP] = useState("");
  const [result, setResult] = useState("");
  const [resultType, setResultType] = useState("");
  const [otpDisplay, setOtpDisplay] = useState("");

  const fillOTP = (value) => {
    const digits = value.split("").slice(0, 6);
    const updated = ["", "", "", "", "", ""];
    digits.forEach((d, i) => {
      updated[i] = d;
    });
    setOtp(updated);
  };

  const getOTP = () => otp.join("");

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(0, 1);
    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);

    if (digit && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const generateOTP = async () => {
    if (!username || !email) {
      setResult("Enter username and email");
      setResultType("error");
      return;
    }

    setOtpDisplay("Generating OTP...");
    setResult("");
    setResultType("");

    try {
      const res = await fetch(
        `http://localhost:5000/generate-otp?username=${encodeURIComponent(
          username
        )}&email=${encodeURIComponent(email)}`
      );

      const data = await res.text();
      const generated = data.split(":")[1]?.trim();

      if (!generated) {
        setOtpDisplay("");
        setResult("Error generating OTP");
        setResultType("error");
        return;
      }

      setCurrentOTP(generated);
      setOtpDisplay(`OTP: ${generated}`);
      fillOTP(generated);
      setResult("OTP Generated ✅");
      setResultType("success");
    } catch (error) {
      const offlineOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setCurrentOTP(offlineOtp);
      setOtpDisplay(`OTP: ${offlineOtp}`);
      fillOTP(offlineOtp);
      setResult("Offline OTP Generated ⚡");
      setResultType("success");
    }
  };

  const verifyOTP = () => {
    const entered = getOTP();

    if (!currentOTP) {
      setResult("Generate OTP first");
      setResultType("error");
      return;
    }

    if (entered === currentOTP) {
      setResult("Verified ✅");
      setResultType("success");
    } else {
      setResult("Invalid ❌");
      setResultType("error");
    }
  };

  const clearAll = () => {
    setUsername("");
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setCurrentOTP("");
    setResult("");
    setResultType("");
    setOtpDisplay("");
  };

  return (
    <div className="page">
      <div className="bg1"></div>
      <div className="bg2"></div>

      <div className="card">
        <h2>🔐 Secure MFA</h2>

        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={generateOTP}>Generate OTP</button>

        <div className="otp-display">{otpDisplay}</div>

        <div className="otp-box">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
            />
          ))}
        </div>

        <div className="row">
          <button onClick={verifyOTP}>Verify</button>
          <button onClick={clearAll}>Clear</button>
        </div>

        <div className={`result ${resultType}`}>{result}</div>
      </div>
    </div>
  );
}

export default App;