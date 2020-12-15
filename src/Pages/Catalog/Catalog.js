import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../../components/LoginButton";
import LogoutButton from "../../components/LogoutButton";

import api from "../../services/api";

import CategoriesData from "../../data/categoriesList.json";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Navbar, NavDropdown } from "react-bootstrap";
import { BsFillStarFill } from "react-icons/bs";
import { BsSearch, BsList } from "react-icons/bs";

import "./Catalog.css";

function Catalog() {
  const { isAuthenticated } = useAuth0();
  const history = useHistory();
  const dispatch = useDispatch();
  const itemsCatalog = useSelector((state) => state.catalog);

  const [inputSearch, setInputSearch] = useState("");

  const [data, setData] = useState([]);
  const [dataListControl, setDataListControl] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  const [priceCount, setPriceCount] = useState(0);
  const [pricePerItem, setPricePerItem] = useState([]);

  const [favorite, setFavorite] = useState(false);
  const [favoriteArray, setFavoriteArray] = useState([]);

  const [, setUnusedState] = useState();
  const forceUpdate = useCallback(() => setUnusedState({}), []);

  const loadApi = useCallback(async () => {
    const response = await api.get("data");
    const dataList = await response.data;
    setDataListControl(dataList);
  }, []);

  useEffect(() => {
    loadApi();
  }, [loadApi]);

  useEffect(() => {
    dataListControl.forEach((e) => Object.assign(e, { item: 0 }));
    setData(dataListControl);
  }, [dataListControl]);

  useEffect(() => {
    const checkItemsInCart = () => {
      itemsCatalog.forEach((index) => {
        const productIndex = data.findIndex((p) => p.id === index.id);

        if (productIndex >= 0) {
          data[productIndex].item = index.amount;
        }
      });
      setData(data);
      forceUpdate();
    };

    checkItemsInCart();

    const totalItemsPriceInCart = itemsCatalog.reduce(
      (sum, { countPerItem }) => {
        return (sum += countPerItem);
      },
      0,
    );
    setPriceCount(totalItemsPriceInCart);
  }, [data, forceUpdate, itemsCatalog]);

  useEffect(() => {
    data.forEach((e) => Object.assign(e, { item: 0 }));

    const fetchItems = () => {
      const dataCategories = CategoriesData;
      setCategoriesList(dataCategories);

      dataListControl.forEach((e) => pricePerItem.splice(0, 0, 0));
      setPricePerItem(pricePerItem);
    };

    function checkForFavorites() {
      dataListControl.forEach((e) => favoriteArray.splice(0, 0, false));

      const getFavoriteArray = JSON.parse(
        localStorage.getItem("favoriteArray"),
      );

      if (getFavoriteArray !== null) {
        setFavoriteArray(getFavoriteArray);
      } else {
        localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
      }
    }

    fetchItems();
    checkForFavorites();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (inputSearch === "") {
      const filterPerSearch = dataListControl.filter((e) =>
        e.name.toLowerCase().includes(inputSearch),
      );
      setData(filterPerSearch);
    }
  }, [inputSearch, dataListControl]);

  function handleAddItem(event, element, index) {
    event.preventDefault();

    let price = parseFloat(element.price);
    let count = priceCount + price;

    setPriceCount(count);

    let amount = parseInt(element.item) + 1;
    element.item = amount;

    let countPerItem = price * amount;
    pricePerItem[index] = countPerItem;

    const product = {
      id: element.id,
      name: element.name,
      photo: element.photo,
      amount: amount,
      countPerItem: countPerItem,
      price: price,
    };

    dispatch({
      type: "ADD_ITEM",
      product,
    });
  }

  function handleRemoveItem(event, element, index) {
    event.preventDefault();

    let price = parseFloat(element.price);
    let amount = parseInt(element.item) - 1;

    element.item = amount;

    let countPerItem = pricePerItem[index] - price;
    let count = priceCount - price;
    pricePerItem[index] = countPerItem;

    if (amount <= 0) {
      amount = 0;
      element.item = 0;
      pricePerItem[index] = 0;
      price = 0;
      countPerItem = 0;
      count = 0;

      const product = {
        id: element.id,
        name: element.name,
        photo: element.photo,
        amount: amount,
        countPerItem: countPerItem,
      };

      dispatch({
        type: "REMOVE_ITEM",
        product,
      });
    }

    dispatch({
      type: "UPDATE_REMOVE_ITEM",
      id: element.id,
      amount: amount,
      countPerItem: countPerItem,
      price: price,
    });

    setPriceCount(count);
  }

  function handleAddFavorite(event, index) {
    event.preventDefault();

    const favoriteType = favorite === false ? true : false;
    favoriteArray[index] = favoriteType;

    setFavorite(favoriteType);
    localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
  }

  function handleFilterCategories(event, element, index) {
    const { id } = element;

    const filterPerCategory = dataListControl.filter(
      (e) => e.category_id === id,
    );
    setData(filterPerCategory);
  }

  function handleCategories(event) {
    setData(dataListControl);
  }

  function handleSearch(event) {
    const filterPerSearch = dataListControl.filter((e) =>
      e.name.toLowerCase().includes(inputSearch),
    );
    setData(filterPerSearch);
  }

  const handleBuy = () => {
    const path = "/cart";
    history.push(path);
  };

  return (
    <>
      <header className="headerCatalog">
        <div className="search">
          <input
            type="text"
            placeholder="Buscar..."
            onChange={(e) => setInputSearch(e.target.value)}
          />
          <button onClick={(event) => handleSearch(event)}>
            <BsSearch size={30} />
          </button>
        </div>

        <Navbar>
          <NavDropdown title={<BsList size={40} />} id="nav-dropdown">
            {categoriesList.map((element, index) => (
              <NavDropdown.Item
                onClick={(event) =>
                  handleFilterCategories(event, element, index)
                }
                key={element.id}
              >
                {element.name}
              </NavDropdown.Item>
            ))}
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={(event) => handleCategories(event)}>
              Todos os Produtos
            </NavDropdown.Item>
          </NavDropdown>
        </Navbar>

        {isAuthenticated && <LogoutButton size={90} />}
      </header>

      <main className="table-responsive container-card">
        {data.map((element, index) => (
          <Card className="row card-content" key={element.id}>
            <Card.Img
              variant="center"
              src={element.photo}
              className="col-sm-12 col-md-3"
              style={{ marginTop: "15px", marginBottom: "15px" }}
            />

            <Card.Body className="col-sm-12 col-md-5 text-left my-auto">
              <Card.Title style={{ height: "40px" }}>{element.name}</Card.Title>

              <Card.Text>
                R$ {element.price.toFixed(2).replace(".", ",")}
              </Card.Text>
            </Card.Body>

            <Card.Body className="col-sm-6 col-md-2 text-center my-auto">
              <Card.Text>{element.item} UN</Card.Text>

              <Button
                variant="success"
                style={{ width: "70%", marginTop: "20%" }}
                value={element.item}
                onClick={(event) => handleAddItem(event, element, index)}
              >
                +
              </Button>
            </Card.Body>

            <Card.Body className="col-sm-6 col-md-2 text-center my-auto">
              <button
                className="favorite"
                style={{ width: "100%" }}
                value={favorite}
                onClick={(event) => handleAddFavorite(event, index)}
              >
                {favoriteArray[index] ? (
                  <BsFillStarFill size={30} color="goldenrod" />
                ) : (
                  <BsFillStarFill size={30} />
                )}
              </button>

              <Button
                variant="danger"
                style={{ width: "70%", marginTop: "27%" }}
                value={element.item}
                onClick={(event) => handleRemoveItem(event, element, index)}
              >
                -
              </Button>
            </Card.Body>
          </Card>
        ))}
      </main>

      <footer>
        {isAuthenticated ? (
          <div className="footer">
            <Button
              variant="success"
              style={{ width: "30%" }}
              value={priceCount}
              onClick={handleBuy}
            >
              Comprar R$ {priceCount.toFixed(2).replace(".", ",")}
            </Button>
          </div>
        ) : (
          <LoginButton />
        )}
      </footer>
    </>
  );
}

export default Catalog;
