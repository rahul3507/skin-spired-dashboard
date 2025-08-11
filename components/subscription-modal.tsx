"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  editingPlan: string | null
}

export default function SubscriptionModal({ isOpen, onClose, editingPlan }: SubscriptionModalProps) {
  const [planName, setPlanName] = useState("")
  const [price, setPrice] = useState("")
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [features, setFeatures] = useState("")

  useEffect(() => {
    if (editingPlan) {
      // Pre-fill form if editing an existing plan
      if (editingPlan === "Premium") {
        setPlanName("Premium")
        setPrice("125")
        setBillingCycle("yearly")
        setFeatures(
          "Cancel anytime without a long-term commitment.\n" +
            "Spread costs across smaller, manageable payments.\n" +
            "Ideal for testing or temporary projects.\n" +
            "Easily switch plans as needs change.\n" +
            "Avoid a big initial payment.",
        )
      } else if (editingPlan === "Basic") {
        setPlanName("Basic")
        setPrice("99")
        setBillingCycle("monthly")
        setFeatures(
          "Pay less per month compared to monthly plans.\n" +
            "One-time annual payment.\n" +
            "Exclusive features or often included.\n" +
            "Ideal for long-term goals and stability.\n" +
            "Many plans offer enhanced support for annual subscribers.",
        )
      }
    } else {
      // Reset form for new subscription
      setPlanName("")
      setPrice("")
      setBillingCycle("monthly")
      setFeatures("")
    }
  }, [editingPlan, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-md bg-white p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          {editingPlan ? `Edit ${editingPlan} Plan` : "Add New Subscription Plan"}
        </h2>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plan-name">Plan Name</Label>
            <Input
              id="plan-name"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="e.g. Premium, Basic, Pro"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-7"
                placeholder="99"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Billing Cycle</Label>
            <RadioGroup value={billingCycle} onValueChange={setBillingCycle} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Monthly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly">Yearly</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Features (one per line)</Label>
            <Textarea
              id="features"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Enter features, one per line"
              rows={5}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="button" className="flex-1 bg-teal-800 hover:bg-teal-700">
              {editingPlan ? "Update Plan" : "Add Plan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
