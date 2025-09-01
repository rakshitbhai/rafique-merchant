import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setFilter,
  setSelectedProperty,
  setViewMode,
  selectFilters,
  selectSelectedProperty,
  selectViewMode,
  selectFilteredProperties,
} from "../store/slices/propertiesSlice";
import SimpleSwipeProperties from "./SimpleSwipeProperties";

const ElegantFeaturedProperties = () => {
  const dispatch = useDispatch();

  // Redux selectors
  const filters = useSelector(selectFilters);
  const selectedProperty = useSelector(selectSelectedProperty);
  const viewMode = useSelector(selectViewMode);
  const filteredProperties = useSelector(selectFilteredProperties);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilter({ filterType, value }));
  };

  const handlePropertyClick = (property) => {
    dispatch(setSelectedProperty(property));
  };

  const handleCloseModal = () => {
    dispatch(setSelectedProperty(null));
  };

  const handleViewModeChange = () => {
    const newMode = viewMode === "grid" ? "swipe" : "grid";
    dispatch(setViewMode(newMode));
  };

  // Filter properties
  const searchFilteredProperties = filteredProperties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort properties
  const sortedProperties = [...searchFilteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "location":
        return a.location.localeCompare(b.location);
      default:
        return 0;
    }
  });

  return (
    <>
      {viewMode === "swipe" ? (
        <SimpleSwipeProperties
          onBackToGrid={handleViewModeChange}
          onFilterChange={handleFilterChange}
          onPropertyClick={handlePropertyClick}
          filters={filters}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      ) : (
        <section className="properties-section section-pad">
          <div className="container">
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 className="section-heading">Featured Portfolio</h2>
              <p className="subheading" style={{ margin: "0 auto" }}>
                A curated selection of distinguished residences exemplifying
                craftsmanship, location advantage and asset resilience.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="portfolio-top-bar">
              <div className="filters-inline">
                <button
                  className={`filter-pill ${!filters.type ? "active" : ""}`}
                  onClick={() => handleFilterChange("type", null)}
                >
                  ALL
                </button>
                <button
                  className={`filter-pill ${
                    filters.type === "Penthouse" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("type", "Penthouse")}
                >
                  PENTHOUSE
                </button>
                <button
                  className={`filter-pill ${
                    filters.type === "Villa" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("type", "Villa")}
                >
                  VILLA
                </button>
                <button
                  className={`filter-pill ${
                    filters.type === "Estate" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("type", "Estate")}
                >
                  ESTATE
                </button>
                <button
                  className={`filter-pill ${
                    filters.type === "Loft" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("type", "Loft")}
                >
                  LOFT
                </button>
              </div>

              <div className="filter-bar refined">
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="location">Location</option>
                </select>

                <button
                  onClick={handleViewModeChange}
                  className="cta"
                  style={{ fontSize: "0.75rem", padding: "0.75rem 1.5rem" }}
                >
                  {viewMode === "grid" ? "SWIPE VIEW" : "GRID VIEW"}
                </button>
              </div>
            </div>

            {/* Normal CSS Grid */}
            <div
              className="properties-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
                marginTop: "2rem",
              }}
            >
              {sortedProperties.map((property) => (
                <div
                  key={property.id}
                  className={`card ${property.featured ? "feature-card" : ""}`}
                  onClick={() => handlePropertyClick(property)}
                >
                  <div
                    className="card-media"
                    style={{ backgroundImage: `url(${property.image})` }}
                  >
                    <div className="card-skeleton">
                      <div className="skel-shimmer"></div>
                    </div>
                  </div>

                  <button className="quick-view-tag">VIEW</button>

                  <div
                    className="badge"
                    style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      zIndex: 3,
                    }}
                  >
                    {property.type}
                  </div>

                  <div className="card-content">
                    <h3>{property.title}</h3>
                    <div className="price">
                      ${property.price.toLocaleString()}
                    </div>
                    <div className="location">{property.location}</div>
                    <div className="card-meta-row">
                      <span>{property.bedrooms} bed</span>
                      <span>{property.bathrooms} bath</span>
                      <span>{property.sqft} sqft</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal */}
          {selectedProperty && (
            <div className="modal-portal">
              <div className="modal-backdrop" onClick={handleCloseModal} />
              <div
                className="modal-panel glass-strong"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="modal-media"
                  style={{ backgroundImage: `url(${selectedProperty.image})` }}
                />
                <div className="modal-body">
                  <button className="modal-close" onClick={handleCloseModal}>
                    ×
                  </button>
                  <h2 className="modal-title">{selectedProperty.title}</h2>
                  <div className="modal-price">
                    ${selectedProperty.price.toLocaleString()}
                  </div>
                  <div className="modal-meta">{selectedProperty.location}</div>
                  <p style={{ marginTop: "1.5rem" }}>
                    {selectedProperty.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default ElegantFeaturedProperties;
