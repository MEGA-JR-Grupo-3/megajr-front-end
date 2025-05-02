import Image from "next/image";
import PatoImg from "../../public/assets/pato.png";
import Button from "../components/Button/Button.jsx";

export default function Home() {
  return (
    <div className="bg-[var(--background)] text-[var(--text)] flex flex-col items-center justify-items-center min-h-screen p-2 pb-[50px] transition-all duration-300">
      <Image src={PatoImg} width={"200px"} height={"auto"} alt="Pato" />
      <div className="flex flex-col items-center justify-items-center">
        <h1 className="text-2xl font-bold text-center pb-[58px]">
          Já é parceiro do Jubileu?
        </h1>
        <Button buttonText="Fazer Login" buttonStyle="mb-[40px]"></Button>
        <Button buttonText="Cadastrar-se"></Button>
      </div>
    </div>
  );
}
