import CardOrder from "../../Atoms/CardOrder";
import Order from "../../../Type/Order";
import { useState, useEffect } from "react";
import OrderPlaceholder from "../../Atoms/OrderPlaceholder";
import NavItem from "../../Atoms/NavItem";
import { AiFillFileAdd } from "react-icons/ai";
import Routes from "../../../Router/Routes";
import { HOST } from "../../../utils/envirementConfiguration";
import cardOrderStyles from "../../Atoms/CardOrder/styles";
import CompletedTasks from "../../Atoms/CompletedTasks";
import * as ChakraUI from "@chakra-ui/react";

const {
  Center,
  Divider,
  Flex,
  Input,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Heading,
} = ChakraUI;

const ListOrder = () => {
  const [getOrders, setOrders] = useState<Order[]>([]);
  const [getAuthor, setAuthor] = useState("");
  const [getSelect, setSelect] = useState("");
  const [placement, setPlacement] = useState("En Proceso");

  const fetching = () => {
    fetch(`http://${HOST}/task`)
      .then((response) => response.json())
      .then((orderss: Order[]) => {
        setOrders(orderss);
      });
  };

  useEffect(() => {
    fetching();
    const interval = setInterval(() => {
      fetching();
    }, 600000);
    return () => clearInterval(interval);
  }, []);

  const onChange = (event: any) => {
    setAuthor(event.currentTarget.value);
  };

  const changeInput = (order: Order) => {
    return getSelect === ""
      ? order.author.toLowerCase().includes(getAuthor.toLowerCase())
      : order.employee.toLowerCase().includes(getSelect.toLowerCase()) &&
          order.author.toLowerCase().includes(getAuthor.toLowerCase());
  };

  const renderOrder = (order: Order, index: number) => {
    return (
      <CardOrder order={order} key={`${JSON.stringify(order)}/${index}`} />
    );
  };

  const stateFilter = (order: Order) => {
    switch (placement) {
      case "En Proceso":
        return (
          order.stateOrder.includes(placement) ||
          order.stateOrder.includes("In Process")
        );
      case "Terminados":
        return (
          order.stateOrder.includes(placement) ||
          order.stateOrder.includes("Finished")
        );
      case "Entregados":
        return (
          order.stateOrder.includes(placement) ||
          order.stateOrder.includes("Delivered")
        );
      case "Anulados":
        return (
          order.stateOrder.includes(placement) ||
          order.stateOrder.includes("Canceled")
        );
    }
  };

  const filterTasks = (order: Order) => {
    if (
      order.stateOrder === placement &&
      getAuthor === "" &&
      getSelect === ""
    ) {
      return stateFilter(order);
    } else {
      return changeInput(order) && stateFilter(order);
    }
  };

  const renderContent = () => {
    const OrdersFilters = getOrders.filter(filterTasks);
    if (!getOrders.length) {
      return [0, 1, 2].map((item) => <OrderPlaceholder key={item} />);
    } else if (0 === OrdersFilters.length) {
      return CompletedTasks(placement);
    }
    OrdersFilters.sort(
      (a, b) => new Date(a.deadLine).getTime() - new Date(b.deadLine).getTime()
    );
    return OrdersFilters.map(renderOrder);
  };

  return (
    <Flex flexDirection="column" gap="5" maxW="75%">
      <Flex backgroundColor="white" flexDirection="column" gap="2" padding="5">
        <Heading alignSelf="center" paddingBottom="2">
          Pedidos
        </Heading>
        <Divider />
        <RadioGroup defaultValue={placement} onChange={setPlacement}>
          <Stack direction="row" mb="4" gap="5">
            <Radio value="En Proceso">En Proceso</Radio>
            <Radio value="Terminados">Terminados</Radio>
            <Radio value="Entregados">Entregados</Radio>
            <Radio value="Anulados">Anulados</Radio>
            <Center height="50px" gap="10" paddingLeft="10">
              <Divider orientation="vertical" />
              <NavItem key="CREATE" icon={AiFillFileAdd} to={Routes.CREATE}>
                Crear Pedido
              </NavItem>
            </Center>
          </Stack>
        </RadioGroup>
        <Flex gap="2">
          <Select
            w="15%"
            value={getSelect}
            placeholder="Empleados"
            onChange={(e) => setSelect(e.target.value)}
          >
            {" "}
            <option value="Ilay">Ilay</option>
            <option value="Vero">Vero</option>
            <option value="Gabi">Gabi</option>
            <option value="Dario">Dario</option>
            <option value="Flor">Flor</option>
            <option value="Fran">Fran</option>
          </Select>
          <Input
            w="84%"
            type="text"
            onChange={onChange}
            _placeholder={{ color: "black" }}
            variant="outline"
            placeholder="Buscador"
          />{" "}
        </Flex>
      </Flex>

      <List paddingBottom="2" paddingTop="2">
        <ListItem backgroundColor="white" alignItems="center" padding="2">
          <Divider height="2px" />
          <Flex gap="5" sx={cardOrderStyles.cardCharacteristics}>
            <Flex>
              <Text as="b" ml="2">
                Titulo
              </Text>
            </Flex>
            <Flex>
              <Text as="b" ml="10">
                Cliente
              </Text>
            </Flex>
            <Flex as="b" ml="4">
              <Text>Fecha Ingreso</Text>
            </Flex>
            <Flex>
              <Text as="b">Fecha Limite</Text>
            </Flex>
            <Flex>
              <Text as="b" ml="2">
                Estado
              </Text>
            </Flex>
            <Flex>
              <Text as="b" ml="2">
                Empleado
              </Text>
            </Flex>
            <Flex>
              <Text as="b" mr="2">
                Presupuesto
              </Text>
            </Flex>
          </Flex>
          {renderContent()}
        </ListItem>
      </List>
    </Flex>
  );
};

export default ListOrder;
