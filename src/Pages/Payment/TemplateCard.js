import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";

import { useDispatch } from "react-redux";

import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import Card from "./Card";
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from "./cardUtils";

import { useAuth0 } from "@auth0/auth0-react";

function TemplateCard() {
  const { isAuthenticated } = useAuth0();

  const itemsCatalog = useSelector((state) => state.catalog);

  const [totalItems, setTotalItems] = useState(0);
  const history = useHistory();

  const dispatch = useDispatch();

  const numberRef = useRef(null);
  const nameRef = useRef(null);
  const expiryRef = useRef(null);
  const cvcRef = useRef(null);

  const handleNumber = () => {
    numberRef.current.style.borderColor = "black";
  };

  const handleName = () => {
    nameRef.current.style.borderColor = "black";
  };

  const handleExpiry = () => {
    expiryRef.current.style.borderColor = "black";
  };

  const handleCvc = () => {
    cvcRef.current.style.borderColor = "black";
  };

  const onSubmit = (values) => {
    const dataString = JSON.stringify(values, 0, 2);
    const data = [JSON.parse(dataString)];

    data.every((e) => {
      if (e.number === undefined) {
        window.alert("Preencha o campo número do cartão!");
        numberRef.current.style.borderColor = "red";
      }
      if (e.name === undefined) {
        window.alert("Preencha o campo nome!");
        nameRef.current.style.borderColor = "red";
      }
      if (e.expiry === undefined) {
        window.alert("Preencha o campo data de validade!");
        expiryRef.current.style.borderColor = "red";
      }
      if (e.cvc === undefined) {
        window.alert("Preencha o campo CVC!");
        cvcRef.current.style.borderColor = "red";
      }

      if (
        e.number === undefined ||
        e.name === undefined ||
        e.expiry === undefined ||
        e.cvc === undefined
      ) {
        return false;
      } else {
        // setDataPayload(dataString);

        setTimeout(() => {
          window.alert("Pagamento realizado com sucesso!");

          const product = [];
          dispatch({
            type: "CLEAR_CART",
            product,
          });
        }, 3000);

        setTimeout(() => {
          history.push("/");
        }, 4000);

        return true;
      }
    });
  };

  useEffect(() => {
    const totalItemsPrice = itemsCatalog.reduce((sum, { countPerItem }) => {
      return (sum += countPerItem);
    }, 0);
    setTotalItems(totalItemsPrice);
  }, [itemsCatalog]);

  const handleComeback = () => {
    history.push("/cart");
  };

  return (
    <>
      {isAuthenticated ? (
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Styles>
            <Form
              onSubmit={onSubmit}
              render={({
                handleSubmit,
                form,
                submitting,
                pristine,
                values,
                active,
              }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <Card
                      number={values.number || ""}
                      name={values.name || "Seu Nome Aqui"}
                      expiry={values.expiry || ""}
                      cvc={values.cvc || ""}
                      focused={active}
                    />
                    <div>
                      <Field
                        name="number"
                        component="input"
                        type="text"
                        pattern="[\d| ]{16,22}"
                        placeholder="Número do Cartão"
                        defaultValue=""
                        format={formatCreditCardNumber}
                        ref={numberRef}
                        onClick={handleNumber}
                      />
                    </div>
                    <div>
                      <Field
                        name="name"
                        component="input"
                        type="text"
                        placeholder="Nome"
                        id="inputName"
                        ref={nameRef}
                        onClick={handleName}
                      />
                    </div>
                    <div>
                      <Field
                        name="expiry"
                        component="input"
                        type="text"
                        pattern="\d\d/\d\d"
                        placeholder="Data de Validade"
                        format={formatExpirationDate}
                        ref={expiryRef}
                        onClick={handleExpiry}
                      />
                      <Field
                        name="cvc"
                        component="input"
                        type="text"
                        pattern="\d{3,4}"
                        placeholder="CVC"
                        format={formatCVC}
                        ref={cvcRef}
                        onClick={handleCvc}
                      />
                    </div>

                    <div className="comeback">
                      <div style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>
                        Total: R$ {totalItems.toFixed(2).replace(".", ",")}
                      </div>
                    </div>

                    <div className="buttons">
                      <button
                        type="submit"
                        disabled={submitting}
                        style={{
                          width: "18%",
                          background: "#218838",
                          color: "white",
                          borderColor: "#1e7e34",
                        }}
                      >
                        Pagar
                      </button>
                      <button
                        type="button"
                        onClick={form.reset}
                        disabled={submitting || pristine}
                        style={{ width: "20%" }}
                      >
                        Resetar
                      </button>
                      <Button
                        style={{
                          width: "18%",
                          height: "48px",
                          background: "#007bff",
                          color: "white",
                        }}
                        onClick={handleComeback}
                      >
                        Voltar
                      </Button>
                    </div>
                  </form>
                );
              }}
            />
          </Styles>
        </main>
      ) : (
        history.push("/")
      )}
    </>
  );
}

export default TemplateCard;
