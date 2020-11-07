import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { BsTrash } from "react-icons/bs";

import "./Cart.css";

function Cart() {
  const [totalItems, setTotalItems] = useState(0);
  const [deleteItem, setDeleteItem] = useState(0);
  const dispatch = useDispatch();
  const itemsCatalog = useSelector((state) => state.catalog);
  const history = useHistory();

  useEffect(() => {
    const totalItemsPrice = itemsCatalog.reduce((sum, { countPerItem }) => {
      return (sum += countPerItem);
    }, 0);
    setTotalItems(totalItemsPrice);
  }, []);

  useEffect(() => {
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

  const handleComeback = () => {
    history.push("/");
  };

  const handleBuy = () => {
    history.push("/payment");
  };

  return (
    <>
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

                <Card.Text>{element.amount} UN</Card.Text>
              </Card.Body>

              <Card.Body className="col-sm-6 col-md-2 text-center my-auto">
                <Card.Text>
                  R$ {element.countPerItem.toFixed(2).replace(".", ",")}
                </Card.Text>
              </Card.Body>

              <Card.Body className="col-sm-6 col-md-2 text-center my-auto">
                <button
                  style={{ width: "100%", border: "none" }}
                  value={deleteItem}
                  onClick={(event) => handleRemoveItem(event, index)}
                >
                  <BsTrash size={30} />
                </button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </main>

      <footer className="footerCart">
        {totalItems === 0 ? (
          <Button
            variant="success"
            style={{ width: "40%" }}
            onClick={handleComeback}
          >
            Voltar
          </Button>
        ) : (
          <Button variant="success" style={{ width: "40%" }} onClick={handleBuy}>
            Finalizar Compra
          </Button>
        )}

        <div className="totalPrice">
          Total: R$ {totalItems.toFixed(2).replace(".", ",")}
        </div>
      </footer>
    </>
  );
}

export default Cart;
