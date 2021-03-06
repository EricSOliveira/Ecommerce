import Button from "react-bootstrap/Button";
import { useAuth0 } from "@auth0/auth0-react";

import './style.css';

const LogoutButton = () => {
  const { logout, user  } = useAuth0();

  return (
    <>
      <div className="logout">
        <div className="authenticated">
          <img src={user.picture} alt={user.name} className="photoUser" />

          {/* <Button
            onClick={() => logout()}
            variant="danger"
            style={{ width: "52px", height: "40px" }}
            >
            Sair
          </Button> */}

          <div className="dataUser">
            <div className="dataUserShow">
              Nome: {user.name}
              <br />
              E-mail: {user.email}
              <br />

            </div>
              <Button
                onClick={() => logout()}
                variant="danger"
                style={{ width: "52px", height: "40px" }}
                >
                Sair
              </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutButton;
