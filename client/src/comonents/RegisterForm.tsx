import {
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import FormWrapper from "./FormWrapper";
import {
  FieldErrors,
  RegisterOptions,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { generateVaultKey, hashPassword } from "../crypto";
import { useMutation } from "react-query";
import { Dispatch, HTMLInputTypeAttribute, SetStateAction } from "react";
import { registerUser } from "../api";
import { Step, VaultItem } from "../pages";

function RegisterForm({
  setStep,
  setVaultKey,
}: {
  setStep: Dispatch<SetStateAction<Step>>;
  setVaultKey: Dispatch<SetStateAction<string>>;
}) {
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<{
    email: string;
    password: string;
    hashedPassword: string;
  }>();

  const mutation = useMutation(registerUser, {
    onSuccess: ({ salt, vault }) => {
      const hashedPassword = getValues("hashedPassword");
      const email = getValues("email");
      const vaultKey = generateVaultKey({ email, hashedPassword, salt });

      window.sessionStorage.setItem("vk", vaultKey);
      window.sessionStorage.setItem("vault", "");

      setStep("vault");
      setVaultKey(vaultKey);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return (
    <FormWrapper
      onSubmit={handleSubmit(() => {
        const email = getValues("email");
        const password = getValues("password");
        const hashedPassword = hashPassword(password);
        setValue("hashedPassword", hashedPassword); // why set if not yet used?

        mutation.mutate({ email, hashedPassword });
      })}
    >
      <Heading>Register</Heading>
      <CustomFormControl
        label="Email"
        id="email"
        inputType="email"
        register={register}
        inputRegisterOptions={{
          required: "Email is required",
          minLength: {
            value: 4,
            message: "Email must be 4 characters long",
          },
        }}
        errors={errors}
      />
      <CustomFormControl
        label="Password"
        id="password"
        inputType="password"
        register={register}
        inputRegisterOptions={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be 6 characters long",
          },
        }}
        errors={errors}
      />

      <Button type="submit">Register</Button>
    </FormWrapper>
  );
}

export default RegisterForm;

type RegisterForm = {
  email: string;
  password: string;
  hashedPassword: string;
};

type CustomFormControlProps = {
  label: string;
  id: keyof RegisterForm;
  inputType: HTMLInputTypeAttribute;
  register: UseFormRegister<RegisterForm>;
  inputRegisterOptions: RegisterOptions;
  errors: FieldErrors<RegisterForm>;
};
const CustomFormControl = ({
  label,
  id,
  inputType,
  register,
  inputRegisterOptions,
  errors,
}: CustomFormControlProps) => {
  return (
    <div>
      <FormControl mt="4">
        <FormLabel htmlFor={id}>{label}</FormLabel>
        <Input
          id={id}
          placeholder={label}
          type={inputType}
          {...register(id, { ...inputRegisterOptions })}
        />
        <FormErrorMessage>
          {errors.email && errors.email.message}
        </FormErrorMessage>
      </FormControl>
    </div>
  );
};
