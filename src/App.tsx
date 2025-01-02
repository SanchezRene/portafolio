import React, { useState, useEffect, useRef } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const SECTIONS = [
  { id: "section-1", title: "Sanamente" },
  { id: "section-2", title: "Sección 2" },
  { id: "section-3", title: "Sección 3" },
  { id: "section-4", title: "Sección 4" },
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
              ref={(el) => (sectionRefs.current[index] = el)} // Asignar la referencia a cada sección
              className="min-h-[100vh] rounded-xl bg-muted/50 p-4"
            >
              <h2>{section.title}</h2>
              <p>Contenido de la {section.title}</p>
            </div>
          ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
