import { Cpu, CpuFill } from "react-bootstrap-icons";

export function getCpuIcon(cpu: string) {
  switch (cpu) {
    case "MTL":
        return <Cpu size={18} />;
    case "ARL":
        return <Cpu size={18} />;
    case "LNL":
        return <Cpu size={18} />;
    case "PTL":
        return <Cpu size={18} />;
    default:
        return <CpuFill size={18} />;
  }
}