import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../../components/LogoutButton";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { BsTrash } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { MdAddCircle, MdRemoveCircle } from "react-icons/md";

import "./Cart.css";

function Cart() {
  const { isAuthenticated } = useAuth0();

  const [totalItems, setTotalItems] = useState(0);
  const dispatch = useDispatch();
  const itemsCatalog = useSelector((state) => state.catalog);
  const history = useHistory();

  useEffect(() => {
    const totalItemsPrice = itemsCatalog.reduce((sum, { countPerItem }) => {
      return (sum += countPerItem);
    }, 0);
    setTotalItems(totalItemsPrice);

    const deleteItemCart = itemsCatalog.reduce((sum, { countPerItem }) => {
      return (sum += countPerItem);
    }, 0);
    setTotalItems(deleteItemCart);
  }, [itemsCatalog]);

  function handleRemoveItem(event, index) {
    event.preventDefault();

    const product = itemsCatalog[index];

    dispatch({
      type: "REMOVE_ITEM",
      product,
    });
  }

  function incrementAmount(element) {
    const { id, amount, countPerItem, price } = element;

    dispatch({
      type: "UPDATE_ADD_ITEM",
      id,
      amount,
      countPerItem,
      price,
    });
  }

  function decrementAmount(element) {
    const { id, amount, countPerItem, price} = element;

    dispatch({
      type: "UPDATE_REMOVE_ITEM",
      id,
      amount,
      countPerItem,
      price,
    });
  }

  const handleComeback = () => {
    history.push("/");
  };

  const handleBuy = () => {
    history.push("/payment");
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <header className="headerCart">
            <h3>Seus Pedidos</h3>
            <LogoutButton />
          </header>

          {itemsCatalog.length === 0 ? (
            <main className="mainCartEmpty">
              <FaShoppingCart size={120} />
              <hr />
              <h2>Não há itens em seu carrinho!</h2>
            </main>
          ) : (
            <main className="mainCart">
              <div className="table-responsive container-card">
                {itemsCatalog.map((element, index) => (
                  <Card className="row card-content" key={element.id}>
                    <Card.Img
                      variant="center"
                      src={element.photo}
                      className="col-sm-12 col-md-3"
                      style={{ marginTop: "15px", marginBottom: "15px" }}
                    />

                    <Card.Body className="col-sm-12 col-md-5 text-left my-auto">
                      <Card.Title style={{ height: "40px" }}>
                        {element.name}
                      </Card.Title>

                      <Card.Text className="ml-2">
                        <strong>{element.amount}</strong> UN
                      </Card.Text>

                      <button
                        type="button"
                        onClick={() => decrementAmount(element)}
                        className="border-0 bg-transparent"
                      >
                        <MdRemoveCircle size={27} color="#191919" />
                      </button>

                      <button
                        type="button"
                        onClick={() => incrementAmount(element)}
                        className="border-0 bg-transparent"
                      >
                        <MdAddCircle size={27} color="#191919" />
                      </button>
                    </Card.Body>

                    <Card.Body className="col-sm-6 col-md-2 text-center my-auto">
                      <Card.Text>
                        R$ {element.countPerItem.toFixed(2).replace(".", ",")}
                      </Card.Text>
                    </Card.Body>

                    <Card.Body className="col-sm-6 col-md-2 text-center my-auto">
                      <button
                        style={{
                          width: "100%",
                          border: "none",
                          background: "transparent",
                        }}
                        onClick={(event) => handleRemoveItem(event, index)}
                      >
                        <BsTrash size={30} />
                      </button>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </main>
          )}

          <footer className="footerCart">
            {totalItems === 0 ? (
              <Button
                variant="primary"
                style={{ width: "40%", marginLeft: "15%" }}
                onClick={handleComeback}
              >
                Voltar
              </Button>
            ) : (
              <>
                <Button
                  variant="primary"
                  style={{ width: "25%" }}
                  onClick={handleComeback}
                >
                  Voltar
                </Button>

                <Button
                  variant="success"
                  style={{ width: "25%" }}
                  onClick={handleBuy}
                >
                  Finalizar Compra
                </Button>
              </>
            )}

            <div className="totalPrice">
              Total: R$ {totalItems.toFixed(2).replace(".", ",")}
            </div>
          </footer>
        </>
      ) : (
        history.push("/")
      )}
    </>
  );
}

export default Cart;
