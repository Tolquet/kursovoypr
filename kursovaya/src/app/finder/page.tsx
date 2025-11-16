import FilterPanel from "@/src/widgets/institution-filter/ui/filter";
import InstitutionList from "@/src/widgets/institution-filter/ui/filtred-list";


export default function FinderPage() {

  return (
    <>
      <div className="finder-page">
        <aside className="filters-sidebar">
          <FilterPanel
            filters={filters}
            onFiltersChange={updateFilters}
          />
        </aside>

        <main className="results-content">
          <InstitutionList filters={filters} />
        </main>
      </div>
    </>
  );
}