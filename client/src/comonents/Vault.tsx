import { useFieldArray, useForm } from "react-hook-form";
import { VaultItem } from "../pages";
import FormWrapper from "./FormWrapper";
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { encryptVault } from "../crypto";

function Vault({
  vault = [],
  vaultKey = "",
}: {
  vault: VaultItem[];
  vaultKey: string;
}) {
  const { control, register, handleSubmit } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vault",
  });
  return (
    <FormWrapper
      onSubmit={handleSubmit(({ vault }) => {
        
        window.sessionStorage.setItem("vault", JSON.stringify(vault));
        
        const encryptedVault = encryptVault({
          vault: JSON.stringify({ vault }),
          vaultKey,
        });

        

      })}
    >
      {fields.map((field, index) => {
        return (
          <Box
            display="flex"
            key={field.id}
            gap="2"
            alignItems="flex-end"
            my="4"
          >
            <FormControl>
              <FormLabel htmlFor="website">Website</FormLabel>
              <Input
                type="url"
                id="website"
                placeholder="Website"
                {...register(`vault.${index}.website`, {
                  required: "Website is required",
                })}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                placeholder="Username"
                {...register(`vault.${index}.username`, {
                  required: "Username is required",
                })}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                type="password"
                id="password"
                autoComplete="current-password"
                placeholder="Password"
                {...register(`vault.${index}.password`, {
                  required: "Password is required",
                })}
              />
            </FormControl>
            <Button
              bg="red.500"
              color="white"
              fontSize="2xl"
              onClick={() => remove(index)}
            >
              -
            </Button>
          </Box>
        );
      })}
      <Button
        onClick={() => append({ website: "", username: "", password: "" })}
      >
        Add
      </Button>
      <Button type="submit" color="teal" ml="4">
        Save vault
      </Button>
    </FormWrapper>
  );
}

export default Vault;
