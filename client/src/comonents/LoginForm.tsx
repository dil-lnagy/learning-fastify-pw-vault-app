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
import { decryptVault, generateVaultKey, hashPassword } from "../crypto";
import { useMutation } from "react-query";
import { Dispatch, HTMLInputTypeAttribute, SetStateAction } from "react";
import { loginUser, registerUser } from "../api";
import { Step, VaultItem } from "../pages";

function LoginForm({
  setStep,
  setVault,
  setVaultKey,
}: {
  setStep: Dispatch<SetStateAction<Step>>;
  setVault: Dispatch<SetStateAction<VaultItem[]>>;
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

  const mutation = useMutation(loginUser, {
    onSuccess: ({ salt, vault }) => {
      const hashedPassword = getValues("hashedPassword");
      const email = getValues("email");
      const vaultKey = generateVaultKey({ email, hashedPassword, salt });

      window.sessionStorage.setItem("vk", vaultKey);

      const decryptedVault = decryptVault({ vault, vaultKey });

      window.sessionStorage.setItem("vault", JSON.stringify(decryptVault));

      setStep("vault");
      setVault(decryptedVault);
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
        setValue("hashedPassword", hashedPassword);

        mutation.mutate({ email, hashedPassword });
      })}
    >
      <Heading>Login</Heading>
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

      <Button type="submit">Login</Button>
    </FormWrapper>
  );
}

export default LoginForm;

type LoginForm = {
  email: string;
  password: string;
  hashedPassword: string;
};

type CustomFormControlProps = {
  label: string;
  id: keyof LoginForm;
  inputType: HTMLInputTypeAttribute;
  register: UseFormRegister<LoginForm>;
  inputRegisterOptions: RegisterOptions;
  errors: FieldErrors<LoginForm>;
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
