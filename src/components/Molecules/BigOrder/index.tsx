import Order from "../../../Type/Order";
import {
  Flex,
  Text,
  Divider,
  Heading,
  FormControl,
  FormLabel,
  Select,
  Input,
  useToast,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ButtonCancel from "../../Atoms/ButtonCancel";
import ButtonSave from "../../Atoms/ButtonSave";
import InputNumber from "../../Atoms/InputNumber";
import InputText from "../../Atoms/InputText";
import SubTitle from "../../Atoms/SubTitle";
import InputDescription from "../../Atoms/InputDescription";
import SelectEstimated from "../../Atoms/SelectEstimated";
import InputDate from "../../Atoms/InputDate/Index";
import NavItem from "../../Atoms/NavItem";
import Routes from "../../../Router/Routes";
import { AddIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import { formatDateAsDatetimeString } from "../../../utils/dateUtils";
import axios from "axios";
import { HOST, IP } from "../../../utils/envirementConfiguration";
import formStyles from "../FormOrder/styles";

interface Props {
  order: Order;
}
type ToastState = "info" | "warning" | "success" | "error" | "loading";

const BigOrder = (props: Props) => {
  const toast = useToast();
  const [getState, setState] = useState("");
  const {
    _id,
    title,
    author,
    dateCurrent,
    estimatedTime,
    description,
    deadLine,
    employee,
    budget,
    stateOrder,
    cashAdvance,
    phone,
  } = props.order;
  const dLine = new Date(deadLine);
  const currentDate = new Date();
  const isOkey = Math.round(
    (dLine.getTime() - currentDate.getTime()) / 86400000
  );
  const confirmPassword = (values: Object, password: String) => {
    if (isOkey < 0 && stateOrder === "En Proceso") {
      customToast("error", "Modifique el plazo");
    } else {
      const userInput = prompt("Por favor, ingrese la contraseña");
      if (userInput === password) {
        submiteOk(values);
        customToast("success", "Modificaciones Realizadas");
      } else {
        customToast("error", "Contraseña Incorrecta");
      }
    }
  };
  const customToast = (state: ToastState, description: String) => {
    toast({
      title: state.toUpperCase(),
      description: description,
      status: state,
      duration: 9000,
      isClosable: true,
    });
  };
  const submiteOk = (values: Object) => {
    axios({
      method: "PUT",
      url: `http://${HOST}/task/${_id}`,
      data: values,
    })
      .then(function (res) {
        window.location.href = `http://${IP}:3000`;
      })
      .catch(function (res) {
        alert("Hubo un problema");
        console.log(`http://${HOST}/task/${_id}`);
      })
      .finally(() => (window.location.href = `http://${IP}:3000`));
  };

  const handleSelectChange = (values: Object) => {
    setState(formik.values.stateOrder);
    switch (getState) {
      case "Entregados":
        confirmPassword(values, "5692");
        break;
      case "Anulados":
        confirmPassword(values, "8462");
        break;
      case "En Proceso":
        confirmPassword(values, "2023");
        break;
      case "Terminados":
        confirmPassword(values, "2023");
        break;
    }
  };
  const formik = useFormik({
    initialValues: {
      title: title,
      author: author,
      dateCurrent: formatDateAsDatetimeString(dateCurrent),
      estimatedTime: estimatedTime,
      description: description,
      deadLine: formatDateAsDatetimeString(deadLine),
      employee: employee,
      budget: budget,
      stateOrder: stateOrder,
      cashAdvance: cashAdvance,
      phone: phone,
    },
    onSubmit: (values) => {
      handleSelectChange(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex flexDirection="column" gap="5">
        <Flex justifyContent="start">
          <NavItem key="HOME" to={Routes.HOME}>
            {"< Volver atrás"}
          </NavItem>
        </Flex>
        <Flex gap="5" alignItems="center" justifyContent="center">
          <AddIcon boxSize={6} />
          <Heading size="lg">Ver o modificar un pedido</Heading>
        </Flex>
        <Flex gap="5" flexDirection="column">
          <Divider w="868px" border="1px" color="gray.700" />
          <Text as="b" color="gray.500">
            DATOS DEL PEDIDO
          </Text>
        </Flex>

        <Flex flexDirection="column" alignItems="center" gap="5">
          <Flex
            flexDirection="column"
            gap="5"
            backgroundColor="white"
            padding="10"
          >
            <Flex gap="5">
              <InputText name="Título" value={title} disabled={true} />
              <InputText
                name="Empleado a cargo"
                value={employee}
                disabled={true}
              />
              <FormControl>
                <FormLabel>Select option</FormLabel>
                <Select
                  border="1px"
                  borderColor="gray"
                  borderRadius="1px"
                  id="stateOrder"
                  name="stateOrder"
                  value={formik.values.stateOrder}
                  onChange={formik.handleChange}
                >
                  <option value="En Proceso">En Proceso</option>
                  <option value="Terminados"> Terminados</option>
                  <option value="Entregados"> Entregados</option>
                  <option value="Anulados"> Anulados</option>
                  {}
                </Select>
              </FormControl>
            </Flex>
            <Flex gap="4">
              <InputDescription
                name="Descripción"
                value={description}
                disabled={true}
              />
            </Flex>
            <SubTitle name="DATOS DEL CLIENTE" gap={3} />
            <Flex gap="4">
              <InputText
                name="Nombre del cliente"
                placeholder="Nombre y apellido..."
                value={author}
                disabled={true}
              />
              <InputText
                name="Número de teléfono"
                placeholder="Número de teléfono..."
                value={phone.toString()}
                disabled={true}
              />
            </Flex>
            <SubTitle name="DATOS DEL PLAZO" gap={3} />
            <Flex gap="5">
              <InputDate
                text="Fecha de ingreso"
                disabled={true}
                value={dateCurrent}
              />
              <SelectEstimated
                name="Tiempo estimado"
                value={estimatedTime}
                disabled={true}
              />
              <InputDate
                text="Fecha de entrega"
                disabled={true}
                value={deadLine}
              />
            </Flex>
            <SubTitle name="PRESUPUESTO" gap={3} />
            <Flex gap="4">
              <InputNumber
                name="Seña"
                placeholder="Escribe un valor..."
                value={cashAdvance}
                disabled={true}
              />
              <FormControl>
                <FormLabel htmlFor="budget">Número de presupuesto</FormLabel>
                <Input
                  placeholder="Número un presupuesto..."
                  id="budget"
                  name="budget"
                  type="number"
                  sx={formStyles.input}
                  onChange={formik.handleChange}
                  value={formik.values.budget}
                  required
                />
              </FormControl>
            </Flex>
          </Flex>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex gap="5">
            <Flex>
              <Link key="MODIFY" to={`${Routes.MODIFY}/${_id}`}>
                <Button
                  w="175px"
                  borderRadius="1px"
                  bg="#ff375b"
                  color="white"
                  size="lg"
                >
                  Extender plazo
                </Button>
              </Link>
            </Flex>
            <Flex>
              <Link key="HISTORIAL" to={`${Routes.HISTORIAL}/${_id}`}>
                <Button
                  w="175px"
                  borderRadius="1px"
                  bg="#ff375b"
                  color="white"
                  size="lg"
                >
                  Historial
                </Button>
              </Link>
            </Flex>
          </Flex>
          <Flex gap="5">
            <ButtonCancel />
            <ButtonSave />
          </Flex>
        </Flex>
      </Flex>
    </form>
  );
};

export default BigOrder;
