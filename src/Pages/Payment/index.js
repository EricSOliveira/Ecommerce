import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";

import Styles from './Styles'
import { Form, Field } from 'react-final-form'
import Card from './Card'
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate
} from './cardUtils'


function TemplateCard() {
  const itemsCatalog = useSelector((state) => state.catalog);
  console.log('itemsCatalog', itemsCatalog)
  const [totalItems, setTotalItems] = useState(0);
  const history = useHistory();
  

  const [dataPayload, setDataPayload] = useState([])
  // const [name, setName] = useState('')

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const onSubmit = async values => {
    await sleep(300)
    window.alert(JSON.stringify(values, 0, 2))
    const data = JSON.stringify(values, 0, 2)
    setDataPayload(data)

    console.log('data', data)
  }


  useEffect(() => {
    
    

    const totalItemsPrice = itemsCatalog.reduce((sum, { countPerItem }) => {
      return (sum += countPerItem);
    }, 0);
    setTotalItems(totalItemsPrice);
  }, []);


  useEffect(() => {
    console.log('dataPayload', dataPayload)
  }, [dataPayload])


  const handleBuy = () => {
    history.push("/cart");
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }} >
      <Styles>
      <Form
        onSubmit={onSubmit}
        render={({
          handleSubmit,
          form,
          submitting,
          pristine,
          values,
          active
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Card
                number={values.number || ''}
                name={values.name || ''}
                expiry={values.expiry || ''}
                cvc={values.cvc || ''}
                focused={active}
              />
              <div>
                <Field
                  name="number"
                  component="input"
                  type="text"
                  pattern="[\d| ]{16,22}"
                  placeholder="Número do Cartão"
                  format={formatCreditCardNumber}
                />
              </div>
              <div>
                <Field
                  name="name"
                  component="input"
                  type="text"
                  placeholder="Nome"
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
                />
                <Field
                  name="cvc"
                  component="input"
                  type="text"
                  pattern="\d{3,4}"
                  placeholder="CVC"
                  format={formatCVC}
                />
              </div>
              <div className="buttons">
                <button type="submit" disabled={submitting}>
                  Pagar
                </button>
                <button
                  type="button"
                  onClick={form.reset}
                  disabled={submitting || pristine}
                >
                  Resetar
                </button>
              </div>
              <div className="comeback">
                <Button
                  style={{ width: "20%", height: '48px', margin: '0 0 0 148px' }}
                  onClick={handleBuy}
                >
                  Voltar
                </Button>
                <div style={{ margin: '0 0 15px 20px' }}>
                  Total: R$ {totalItems.toFixed(2).replace(".", ",")}
                </div>
              </div>
              {/* <h2>Values</h2>
              <pre>{JSON.stringify(values, 0, 2)}</pre> */}
            </form>
          )
        }}
      />
    </Styles>
  </div>
  )
}

export default TemplateCard;
