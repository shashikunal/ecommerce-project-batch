import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../state-management/contextApi";
import Styles from "./_auth.module.css";
import toast from "react-hot-toast";

const ActivationCode = () => {
  let { ActivationUser } = useContext(AuthContext);

  let navigate = useNavigate();
  let [state, setState] = useState({
    activationToken: localStorage.getItem("activationToken"),
    successRes: localStorage.getItem("successRes"),
    activationCode: '',
    isLoading: false,
  });
  let { activationToken, successRes, isLoading, activationCode } = state;

  let handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!activationToken || !activationCode.trim()) {
    toast.error("Please enter a valid activation code.");
    return;
  }

  try {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    const response = await ActivationUser({
      activation_token: activationToken,
      activation_code: activationCode.trim(),
    });

    toast.success(
      response?.message || "User account activated successfully!"
    );

    localStorage.removeItem("activationToken");
    localStorage.removeItem("successRes");

    navigate("/auth/login");
  } catch (error) {
    console.error("Activation error:", error);

    toast.error(
      error.response?.data?.message ||
      "Activation link has expired or is unavailable."
    );
  } finally {
    setState((prev) => ({
      ...prev,
      isLoading: false,
    }));
  }
};

  return (
    <section id={Styles.auth}>
      <article className={Styles.auth_block}>
        <header>
          <h1>Activation</h1>
        </header>
        <main>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="activationCode">Activation Code</label>
              <input
                type="text"
                className="form-control"
                name="activationCode"
                placeholder="enter activationCode"
                required
                value={activationCode}
                id="activationCode"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <button>{isLoading ? "loading " : "Activation"}</button>
            </div>
          </form>
        </main>
      </article>
    </section>
  );
};

export default ActivationCode;