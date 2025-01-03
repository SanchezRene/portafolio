import React, { useState, useEffect, useRef } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Card,
  CardContent,

  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SECTIONS = [
  {
    id: "section-1",
    title: "Sanamente",
    videoUrl: "https://www.youtube.com/embed/w-h5z-aidnM?si=MOzOdMjr-jBJ-EM-",
    description: `Frontend: Flutter/Dart (Web)
                  Backend: Firebase Firestore (Base de Datos) Firebase Auth (autenticación de usuarios)
                  Contenedores: Docker`,
    repoLink: "https://github.com/SanchezRene/sanamente",
  },
  {
    id: "section-2",
    title: "Emprendedores UBB",
    videoUrl: "https://www.youtube.com/embed/qob7H-U4bYM?si=qPDxCgxdAIFcmi9Q",
    description: `Frontend: Vite, Chakra UI, Javascript
                  Backend: MERN Stack (MongoDB, Express, React, Node.js). Multer para subir archivos. Jwt para autenticación.
                  `,
    repoLink: "https://github.com/SanchezRene/Emprendedores-Ubb",
  },
  {
    id: "section-3",
    title: "Generación de videos para explicar algoritmos de ordenamiento",
    videoUrl: "https://www.youtube.com/embed/gHVh-J8k0PU?si=NxY8O5ITqfms7s1S",
    description: `Frontend: NextJs 14 usando las nuevas App Routes.
                  Backend: Python, Firebase y Firesore. Flask para manejar las peticiones y ManimCE para renderizar los videos.
                  `,
    repoLink: "https://drive.google.com/file/d/1o-eETlygrwzqu8ep4S-hUcBIcTvy00Rw/view?usp=sharing",
  },

];

function App() {
  const [activeSection, setActiveSection] = useState(""); // Estado para la sección activa
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]); // Arreglo de referencias para las secciones

  const handleScroll = () => {
    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
        setActiveSection(section.getAttribute("data-title") || "Sección 1");
      }
    });
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Crear IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id); // Actualiza la sección activa
          }
        });
      },
      { threshold: 0.6 } // Detecta cuando el 60% de la sección es visible
    );

    // Asignar observador a cada sección
    sectionRefs.current.forEach((ref) => ref && observer.observe(ref));

    // Cleanup
    return () => {
      sectionRefs.current.forEach((ref) => ref && observer.unobserve(ref));
    };
  }, []);

  // Buscar el título dinámico de la sección activa
  const activeSectionTitle =
    SECTIONS.find((section) => section.id === activeSection)?.title || "Inicio";

  // Buscar datos de la sección activa
  const activeSectionData = SECTIONS.find(
    (section) => section.id === activeSection
  );

  return (
    <SidebarProvider>
      <AppSidebar sections={SECTIONS} activeSection={activeSection} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-black px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Aplicación</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{activeSectionTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Secciones dinámicas */}
          {SECTIONS.map((section, index) => (
            <div
              key={section.id}
              id={section.id}
              ref={(el) => (sectionRefs.current[index] = el)}
              className="min-h-[80vh] rounded-xl bg-muted/50 p-4 flex items-center justify-center"
            >
              {activeSection === section.id ? (
                // Contenido dinámico para la sección activa
                <div className="flex flex-col lg:grid lg:grid-cols-3 lg:grid-rows-2 lg:gap-4 w-full">
                  {/* Card del video (más ancha en versión web) */}
                  <Card className="lg:col-span-2 lg:row-span-2">
                    <CardHeader>
                      <CardTitle>Video</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activeSectionData ? (
                        <iframe
                          width="100%"
                          height="315"
                          src={activeSectionData.videoUrl}
                          title="YouTube video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded-lg"
                        ></iframe>
                      ) : (
                        <p>No se encontró contenido para esta sección.</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Card de descripción */}
                  <Card className="lg:col-span-1 lg:row-span-1">
                    <CardHeader>
                      <CardTitle>Tecnologías Usadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activeSectionData?.description
                        ? activeSectionData.description.split("\n").map((line, index) => (
                          <p key={index}>{line}</p>
                        ))
                        : "No hay descripción disponible."}
                    </CardContent>
                  </Card>

                  {/* Card del repositorio */}
                  <Card className="lg:col-span-1 lg:row-span-1 ">
                    <CardHeader>
                      <CardTitle>Repositorio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activeSectionData ? (
                        <a
                          href={activeSectionData.repoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          GitHub
                        </a>
                      ) : (
                        <p>No se encontró enlace al repositorio.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
