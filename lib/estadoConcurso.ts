import { estadoConcurso } from "@prisma/client";

export const getStatusProperties = (estado : estadoConcurso) => {
    switch (estado) {
      case "evaluacion":
        return {
          colorClass: "bg-yellow-100 text-yellow-800 border-yellow-400",
          statusText: "En evaluación",
          icon: "📝",
          next: "finalizado"
        };
      case "finalizado":
        return {
          colorClass: "bg-green-100 text-green-800 border-green-400",
          statusText: "Finalizado",
          icon: "🏆",
          next: "Inscripcion"
        };
      case "inscripcion":
        return {
          colorClass: "bg-blue-100 text-blue-800 border-blue-400",
          statusText: "En inscripción",
          icon: "✍️",
          next: "evaluacion"
        };
      default:
        return {
          colorClass: "bg-gray-100 text-gray-800 border-gray-400",
          statusText: "Estado desconocido",
          icon: "❓"
        };
    }
  };
  