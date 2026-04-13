import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

type RequestDemoFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const interestOptions = [
  "Portfolio Analytics",
  "Deal Underwriting Insights",
  "Market Signal Radar",
] as const;

const roleOptions = [
  "Owner / Operator",
  "Asset Manager",
  "Acquisitions",
  "Investor",
  "Analyst",
  "Other",
] as const;

type InterestOption = (typeof interestOptions)[number];

type FormData = {
  name: string;
  email: string;
  companyName: string;
  role: string;
  interests: InterestOption[];
  message: string;
};

const initialFormData: FormData = {
  name: "",
  email: "",
  companyName: "",
  role: "",
  interests: [],
  message: "",
};

const RequestDemoForm = ({ open, onOpenChange }: RequestDemoFormProps) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleInterestChange = (value: InterestOption) => {
    setFormData((current) => {
      const isSelected = current.interests.includes(value);

      return {
        ...current,
        interests: isSelected
          ? current.interests.filter((item) => item !== value)
          : [...current.interests, value],
      };
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSubmitError("");
    setSubmitSuccess("");
    setIsSubmitting(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/request_demo_data/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          work_email: formData.email,
          company_name: formData.companyName,
          role: formData.role,
          interested_in: formData.interests,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to save demo request");
      }

      setSubmitSuccess(data?.message || "demo data saved successfully");

      setTimeout(() => {
        handleOpenChange(false);
      }, 1000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[min(92vw,720px)] max-w-[720px] rounded-[24px] border border-slate-200 bg-white p-0 shadow-2xl">
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6 space-y-2 text-left">
            <DialogTitle className="text-2xl font-semibold text-slate-900">
              Request a Demo
            </DialogTitle>
            <DialogDescription className="text-base text-slate-500">
              Get a personalized walkthrough tailored to your portfolio.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="demo-name" className="text-base font-medium text-slate-900">
                  Name
                </Label>
                <Input
                  id="demo-name"
                  value={formData.name}
                  onChange={(event) => handleInputChange("name", event.target.value)}
                  placeholder="Your name"
                  className="h-12 rounded-xl border-slate-200 text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-email" className="text-base font-medium text-slate-900">
                  Work Email
                </Label>
                <Input
                  id="demo-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => handleInputChange("email", event.target.value)}
                  placeholder="you@company.com"
                  className="h-12 rounded-xl border-slate-200 text-base"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="demo-company" className="text-base font-medium text-slate-900">
                  Company Name
                </Label>
                <Input
                  id="demo-company"
                  value={formData.companyName}
                  onChange={(event) => handleInputChange("companyName", event.target.value)}
                  placeholder="Company"
                  className="h-12 rounded-xl border-slate-200 text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium text-slate-900">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 text-base">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium text-slate-900">
                What are you interested in?
              </Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {interestOptions.map((option) => {
                  const selected = formData.interests.includes(option);

                  return (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-3 text-base text-slate-900"
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleInterestChange(option)}
                        className="h-4 w-4 rounded-full border-sky-500 text-sky-500 focus:ring-sky-500"
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-message" className="text-base font-medium text-slate-900">
                Message (optional)
              </Label>
              <Textarea
                id="demo-message"
                value={formData.message}
                onChange={(event) => handleInputChange("message", event.target.value)}
                placeholder="Tell us about your portfolio or goals..."
                className="min-h-[110px] rounded-xl border-slate-200 px-4 py-3 text-base"
              />
            </div>

            {submitError ? (
              <p className="text-sm text-red-600">{submitError}</p>
            ) : null}

            {submitSuccess ? (
              <p className="text-sm text-green-600">{submitSuccess}</p>
            ) : null}

            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Request My Demo"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDemoForm;
