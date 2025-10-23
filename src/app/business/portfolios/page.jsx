import { Wrapper } from "@/components/wrapper";

function PortofoliosPage() {
  return (
    <Wrapper className="flex flex-col">
      {/* Header Action*/}
      <section className="flex items-center justify-between gap-0 w-full mb-4">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-2">
            <Input
              className="w-100"
              placeholder="Cari nama client atau perusahaan..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={handleSearchSubmit}>Cari</Button>
            {(searchInput || searchQuery) && (
              <Button variant="outline" onClick={handleClearSearch}>
                Clear
              </Button>
            )}
          </div>

          {/* Service Filter */}
          <div>
            <SelectComponent
              label="Filter By Service"
              placeholder={
                isLoadingServices ? "Loading services..." : "Filter By Service"
              }
              value={serviceFilter}
              onChange={handleServiceFilterChange}
              options={serviceFilterOptions}
              disabled={isLoadingServices}
            />
          </div>

          {/* Clear All Filters */}
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear All Filters
            </Button>
          )}

          <Button onClick={handleRefresh} disabled={isLoading}>
            <MdOutlineLoop className={isLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </Button>
        </div>
        <div>
          <Link href="/business/clients/new">
            <Button>
              <Plus /> New Client
            </Button>
          </Link>
        </div>
      </section>
    </Wrapper>
  );
}

export default PortofoliosPage;
