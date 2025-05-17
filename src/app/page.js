import Image from "next/image";
import PatoGif from "../../public/assets/gif-pato.gif";
import Button from "../components/Button.jsx";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-items-center lg:gap-24 justify-center w-full h-screen transition-all duration-300">
      <Image
        src={PatoGif}
        className="h-[385px] w-auto object-cover"
        alt="Pato"
        priority
      />
      <div className="flex flex-col items-center justify-items-center lg:mr-15">
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
