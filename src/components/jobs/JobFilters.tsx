import type * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobFiltersProps {
  keyword: string;
  city: string;
  experience: string;
  category: string;
  onKeywordChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onExperienceChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
}

const cities = ["All Cities", "Mumbai", "Delhi", "Pune", "Bangalore", "Chennai", "Ahmedabad", "Hyderabad", "Kolkata"];
const experiences = ["Any Experience", "0-1 years", "1-3 years", "2-4 years", "3-5 years", "5+ years"];
const categories = ["All Categories", "Technology", "Healthcare", "Finance", "Marketing", "Sales", "Engineering", "Design", "Customer Service", "Human Resources"];

const Field = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
    {children}
  </div>
);

const JobFilters = ({
  keyword, city, experience, category,
  onKeywordChange, onCityChange, onExperienceChange, onCategoryChange,
}: JobFiltersProps) => (
  <div role="search" aria-label="Filter jobs" className="space-y-5 rounded-lg border border-border bg-card p-5 shadow-card lg:sticky lg:top-24">
    <h2 className="font-display text-xl font-medium">Filter jobs</h2>
    <Field id="filter-keyword" label="Keyword">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          id="filter-keyword"
          placeholder="Job title or skill"
          type="search"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="h-11 pl-10"
        />
      </div>
    </Field>
    <Field id="filter-city" label="City">
      <Select value={city} onValueChange={onCityChange}>
        <SelectTrigger id="filter-city" className="h-11 w-full">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
    <Field id="filter-experience" label="Experience">
      <Select value={experience} onValueChange={onExperienceChange}>
        <SelectTrigger id="filter-experience" className="h-11 w-full">
          <SelectValue placeholder="Experience" />
        </SelectTrigger>
        <SelectContent>
          {experiences.map((e) => (
            <SelectItem key={e} value={e}>{e}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
    <Field id="filter-category" label="Category">
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger id="filter-category" className="h-11 w-full">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  </div>
);

export default JobFilters;
