import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface CatalogBreadcrumbItem {
  id: string;
  title: string;
}

export interface CatalogBreadcrumbViewProps {
  items: CatalogBreadcrumbItem[]; // ordered from root to current
  onNavigate: (id: string | null) => void; // null for root list
}

export function CatalogBreadcrumbView({
  items,
  onNavigate,
}: CatalogBreadcrumbViewProps) {
  const root = { id: "", title: "Catalogs" };
  const chain = [root, ...items];
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {chain.map((it, idx) => {
          const isLast = idx === chain.length - 1;
          return (
            <BreadcrumbItem key={`${it.id}:${idx}`}>
              {isLast ? (
                <BreadcrumbPage>{it.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(it.id || null);
                  }}
                >
                  {it.title}
                </BreadcrumbLink>
              )}
              {!isLast && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
