import { FormControl, FormLabel, Select } from "@chakra-ui/react";

interface Props {
  name: string;
  disabled?: boolean;
  value?: number;
}

const SelectEstimated = (props: Props) => {
  return (
    <FormControl>
      <FormLabel>{props.name}</FormLabel>
      <Select
        disabled={props.disabled}
        bgColor="black"
        color="white"
        placeholder="Select option"
        border="1px"
        borderColor="gray"
        borderRadius="1px"
        value={props.value}
      >
        <option value="1"> 1 - 3 Dias</option>
        <option value="2"> 4 - 7 Dias</option>
        <option value="3"> 7 - 10 Dias</option>
        <option value="4"> 13 - 20 Dias</option>
        <option value="5"> 22 - 30 Dias</option>
        {}
      </Select>
    </FormControl>
  );
};

export default SelectEstimated;
