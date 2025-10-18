"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Check, X, Plus, Users } from "lucide-react";
import { Brand } from "@/lib/api";

interface BrandSelectorProps {
  brands: Brand[];
  selectedBrands: Brand[];
  onBrandsChange: (brands: Brand[]) => void;
  maxSelections?: number;
  showCompetitorMode?: boolean;
}

export default function BrandSelector({
  brands,
  selectedBrands,
  onBrandsChange,
  maxSelections = 5,
  showCompetitorMode = true,
}: BrandSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState<"primary" | "competitor">("primary");

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBrandToggle = (brand: Brand) => {
    if (mode === "primary") {
      // Primary brand mode - only one selection
      onBrandsChange([brand]);
    } else {
      // Competitor mode - multiple selections
      const isSelected = selectedBrands.some((b) => b.id === brand.id);
      if (isSelected) {
        onBrandsChange(selectedBrands.filter((b) => b.id !== brand.id));
      } else if (selectedBrands.length < maxSelections) {
        onBrandsChange([...selectedBrands, brand]);
      }
    }
  };

  const removeBrand = (brandId: string) => {
    onBrandsChange(selectedBrands.filter((b) => b.id !== brandId));
  };

  const getDisplayText = () => {
    if (selectedBrands.length === 0) {
      return mode === "primary"
        ? "Zudio (Primary Brand)"
        : "Select competitors";
    }
    if (selectedBrands.length === 1) {
      return selectedBrands[0].name;
    }
    return `${selectedBrands.length} brands selected`;
  };

  return (
    <div className="relative">
      {/* Mode Toggle */}
      {showCompetitorMode && (
        <div className="flex mb-3 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => {
              setMode("primary");
              // Set Zudio as primary brand
              const zudioBrand = brands.find(
                (brand) => brand.name.toLowerCase() === "zudio"
              );
              if (zudioBrand) {
                onBrandsChange([zudioBrand]);
              }
            }}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "primary"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Zudio Only
          </button>
          <button
            onClick={() => {
              setMode("competitor");
              // Set Zudio + competitors
              const zudioBrand = brands.find(
                (brand) => brand.name.toLowerCase() === "zudio"
              );
              const competitors = brands
                .filter((brand) => brand.name.toLowerCase() !== "zudio")
                .slice(0, 3);
              if (zudioBrand) {
                onBrandsChange([zudioBrand, ...competitors]);
              }
            }}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "competitor"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            vs Competitors
          </button>
        </div>
      )}

      {/* Selected Brands Display */}
      {selectedBrands.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedBrands.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center bg-primary-50 border border-primary-200 rounded-lg px-3 py-2"
            >
              <span className="text-sm font-medium text-primary-700">
                {brand.name}
              </span>
              <button
                onClick={() => removeBrand(brand.id)}
                className="ml-2 text-primary-500 hover:text-primary-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
      >
        <span className="text-gray-700">{getDisplayText()}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Brand List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredBrands.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No brands found
              </div>
            ) : (
              filteredBrands.map((brand) => {
                const isSelected = selectedBrands.some(
                  (b) => b.id === brand.id
                );
                const isDisabled =
                  mode === "competitor" &&
                  !isSelected &&
                  selectedBrands.length >= maxSelections;

                return (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandToggle(brand)}
                    disabled={isDisabled}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      isDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {brand.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {brand.domains.join(", ")}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-primary-600" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {mode === "competitor" && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-500 text-center">
                Select up to {maxSelections} brands for comparison
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
