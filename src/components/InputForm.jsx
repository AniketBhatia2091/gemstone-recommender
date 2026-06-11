import { useState } from 'react';
import { RASHIS, LAGNAS, ISSUES, PLANETS } from '../utils/constants';

/**
 * InputForm — Controlled astrological profile form with validation
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback with form data
 * @param {boolean} props.loading - Whether a recommendation is in progress
 */
export default function InputForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    rashi: '',
    lagna: '',
    currentIssue: '',
    dominantPlanet: '',
    dob: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.rashi) newErrors.rashi = 'Please select your Rashi';
    if (!formData.lagna) newErrors.lagna = 'Please select your Lagna';
    if (!formData.currentIssue) newErrors.currentIssue = 'Please select your primary concern';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || loading) return;
    onSubmit(formData);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Rashi */}
      <div>
        <div className="flex items-baseline gap-2 mb-2">
          <label htmlFor="rashi" className="text-sm font-medium" style={{ color: '#c9a84c' }}>
            Rashi (Moon Sign)
          </label>
          <span className="text-xs italic" style={{ color: '#9b8ea0' }}>Janma Rashi</span>
        </div>
        <select
          id="rashi"
          value={formData.rashi}
          onChange={handleChange('rashi')}
          className="field-select"
          aria-required="true"
          aria-invalid={!!errors.rashi}
        >
          <option value="">Select your Rashi...</option>
          {RASHIS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        {errors.rashi && (
          <p className="text-xs mt-1 animate-slide-down" style={{ color: '#f59e0b' }}>{errors.rashi}</p>
        )}
      </div>

      {/* Lagna */}
      <div>
        <div className="flex items-baseline gap-2 mb-2">
          <label htmlFor="lagna" className="text-sm font-medium" style={{ color: '#c9a84c' }}>
            Lagna (Ascendant)
          </label>
          <span className="text-xs italic" style={{ color: '#9b8ea0' }}>Udaya Lagna</span>
        </div>
        <select
          id="lagna"
          value={formData.lagna}
          onChange={handleChange('lagna')}
          className="field-select"
          aria-required="true"
          aria-invalid={!!errors.lagna}
        >
          <option value="">Select your Lagna...</option>
          {LAGNAS.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
        {errors.lagna && (
          <p className="text-xs mt-1 animate-slide-down" style={{ color: '#f59e0b' }}>{errors.lagna}</p>
        )}
      </div>

      {/* Primary Concern */}
      <div>
        <div className="flex items-baseline gap-2 mb-2">
          <label htmlFor="currentIssue" className="text-sm font-medium" style={{ color: '#c9a84c' }}>
            Primary Concern
          </label>
          <span className="text-xs italic" style={{ color: '#9b8ea0' }}>Iccha / Kāmanā</span>
        </div>
        <select
          id="currentIssue"
          value={formData.currentIssue}
          onChange={handleChange('currentIssue')}
          className="field-select"
          aria-required="true"
          aria-invalid={!!errors.currentIssue}
        >
          <option value="">Select your primary concern...</option>
          {ISSUES.map((i) => (
            <option key={i.value} value={i.value}>{i.label}</option>
          ))}
        </select>
        {errors.currentIssue && (
          <p className="text-xs mt-1 animate-slide-down" style={{ color: '#f59e0b' }}>{errors.currentIssue}</p>
        )}
      </div>

      {/* Dominant Planet (optional) */}
      <div>
        <div className="flex items-baseline gap-2 mb-2">
          <label htmlFor="dominantPlanet" className="text-sm font-medium" style={{ color: '#c9a84c' }}>
            Dominant Planet
            <span className="text-xs font-normal ml-1" style={{ color: '#9b8ea0' }}>(optional)</span>
          </label>
          <span className="text-xs italic" style={{ color: '#9b8ea0' }}>Prabhu Graha</span>
        </div>
        <select
          id="dominantPlanet"
          value={formData.dominantPlanet}
          onChange={handleChange('dominantPlanet')}
          className="field-select"
        >
          <option value="">Not sure / Skip</option>
          {PLANETS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Date of Birth (optional) */}
      <div>
        <div className="flex items-baseline gap-2 mb-2">
          <label htmlFor="dob" className="text-sm font-medium" style={{ color: '#c9a84c' }}>
            Date of Birth
            <span className="text-xs font-normal ml-1" style={{ color: '#9b8ea0' }}>(optional)</span>
          </label>
          <span className="text-xs italic" style={{ color: '#9b8ea0' }}>Janma Tithi</span>
        </div>
        <input
          type="date"
          id="dob"
          value={formData.dob}
          onChange={handleChange('dob')}
          max={today}
          className="field-input"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full mt-2"
        id="submit-btn"
      >
        {loading ? (
          <>
            <span className="btn-spinner" />
            Consulting the stars...
          </>
        ) : (
          'Reveal My Gemstone →'
        )}
      </button>
    </form>
  );
}
