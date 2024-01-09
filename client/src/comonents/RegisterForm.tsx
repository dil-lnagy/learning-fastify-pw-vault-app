import {
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import FormWrapper from "./FormWrapper";
import {
  FieldErrors,
  RegisterOptions,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { hashPassword } from "../crypto";
import { useMutation } from "react-query";
import { HTMLInputTypeAttribute } from "react";
import { registerUser } from "../api";

function RegisterForm() {
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

  const mutation = useMutation(registerUser);
  return (
    <FormWrapper
      onSubmit={handleSubmit(() => {
        const password = getValues("password");
        const hashedPassword = hashPassword(password);
        setValue("hashedPassword", hashedPassword);
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
