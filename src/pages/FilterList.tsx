import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const FilterList = () => {
  const { control, handleSubmit } = useForm();
  const [items, setItems] = useState([
    { id: 1, name: "Apple", type: "Fruit" },
    { id: 2, name: "Carrot", type: "Vegetable" },
    { id: 3, name: "Banana", type: "Fruit" },
    { id: 4, name: "Broccoli", type: "Vegetable" },
  ]);

  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterType] = useState("");

  const onSubmit = (data) => {
    console.log(data);
  };

  const filteredItems = items
    .filter((item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase())
    )
    .filter((item) => (filterType === "" ? true : item.type === filterType));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        control={control}
        name="filterText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Filter by name</FormLabel>
            <FormControl>
              <Input
                placeholder="Filter by name"
                {...field}
                value={filterText}
                onChange={(e) => {
                  setFilterText(e.target.value);
                  field.onChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="filterType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Filter by type</FormLabel>
            <FormControl>
              <select
                {...field}
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  field.onChange(e);
                }}
              >
                <option value="">All</option>
                <option value="Fruit">Fruit</option>
                <option value="Vegetable">Vegetable</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <ul>
        {filteredItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </form>
  );
};

export default FilterList;
