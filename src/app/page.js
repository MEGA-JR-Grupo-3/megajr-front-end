import Image from "next/image";
import PatoImg from "../../public/assets/pato.png";
import Button from "../components/Button.jsx";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center transition-all duration-300">
      <Image src={PatoImg} className="h-[485px] w-auto" alt="Pato" priority />
      <div className="flex flex-col items-center justify-items-center">
        <h1 className="text-2xl font-bold text-center pb-[58px]">
          Já é parceiro do Jubileu?
        </h1>
        <Button
          buttonText="Fazer Login"
          buttonStyle="mb-[40px]"
          buttonLink="/login"
        ></Button>
        <Button buttonText="Cadastrar-se" buttonLink="/register"></Button>
      </div>
    </div>
  );
}
