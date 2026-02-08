import { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
return(
    <div>
    <h2 className="login-container">Login</h2>
    <form >
        <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Entrar</button>
    </form>
    </div>
)
}
export default Login