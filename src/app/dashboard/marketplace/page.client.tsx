"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from '@/lib/AuthContext';
import Link from "next/link";
import Image from "next/image";
import { generateArticle } from "@/app/api/ai";

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'https://godlywomenn.onrender.com';

function buildAbsoluteUrl(base: string, path: string) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/media/')) {
    const b = String(base || '').replace(/\/$/, '');
    return b + path;
  }
  const b = String(base || '').replace(/\/$/, '');
  const p = path.startsWith('/') ? path : '/' + path;
  return b + p;
}

type ItemType = "Product" | "Service" | "Event";

type MarketplaceItem = {
  id: string;
  title: string;
  description?: string;
  price?: string;
  currency?: string;
  type: ItemType;
  date?: string | null; // for events
  contact?: string | null;
  countryCode?: string | null;
  image?: string | null;
};

function MarketplaceForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<MarketplaceItem>;
  onSave: (data: Partial<MarketplaceItem> | FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<MarketplaceItem>>(initial || {});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  useEffect(() => {
    setForm(initial || {});
    // clear image selection when initial changes
    setImageFile(null);
  }, [initial]);

  const handleGenerateDescription = async () => {
    if (!form.title) {
      alert('Please enter a title first');
      return;
    }
    setIsGeneratingDescription(true);
    try {
      const prompt = `generate marketplace listing description for: ${form.title} (${form.type || 'Product'})`;
      const description = await generateArticle(prompt, 150);
      setForm({ ...form, description });
    } catch (err: any) {
      alert('Failed to generate description. Please try again.');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
          // If an image is attached, use FormData
          if (imageFile) {
            const fd = new FormData();
            // Add all form fields, including image
            Object.entries(form).forEach(([k, v]) => {
              if (v !== undefined && v !== null && k !== 'image') {
                fd.append(k, String(v));
              }
            });
            fd.append('image', imageFile, imageFile.name);
            await onSave(fd);
          } else if (form.image === null && initial?.image) {
            // User explicitly removed the image - send FormData to clear it
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => {
              if (v !== undefined && k !== 'image') {
                fd.append(k, String(v));
              }
            });
            // Explicitly append empty image to clear it
            fd.append('image', '');
            await onSave(fd);
          } else {
            await onSave(form);
          }
        } finally {
          setSaving(false);
        }
      }}
      className="space-y-3"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          required
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={form.type || "Product"}
          onChange={(e) => setForm({ ...form, type: e.target.value as ItemType })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option>Product</option>
          <option>Service</option>
          <option>Event</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          value={form.price || ""}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Currency</label>
        <select
          value={form.currency || "KSH"}
          onChange={(e) => setForm({ ...form, currency: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="KSH">KSH - Kenyan Shilling</option>
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="ZAR">ZAR - South African Rand</option>
          <option value="UGX">UGX - Ugandan Shilling</option>
          <option value="TZS">TZS - Tanzanian Shilling</option>
          <option value="RWF">RWF - Rwandan Franc</option>
          <option value="ETB">ETB - Ethiopian Birr</option>
          <option value="NGN">NGN - Nigerian Naira</option>
          <option value="GHS">GHS - Ghanaian Cedi</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">WhatsApp Contact</label>
        <div className="mt-1 flex gap-2">
          <select
            value={form.countryCode || ""}
            onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
            className="block w-32 rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select Country</option>
            <option value="+93">Afghanistan (+93)</option>
            <option value="+358">Åland Islands (+358)</option>
            <option value="+355">Albania (+355)</option>
            <option value="+213">Algeria (+213)</option>
            <option value="+1">American Samoa (+1)</option>
            <option value="+376">Andorra (+376)</option>
            <option value="+244">Angola (+244)</option>
            <option value="+1">Anguilla (+1)</option>
            <option value="+672">Antarctica (+672)</option>
            <option value="+1">Antigua and Barbuda (+1)</option>
            <option value="+54">Argentina (+54)</option>
            <option value="+374">Armenia (+374)</option>
            <option value="+297">Aruba (+297)</option>
            <option value="+61">Australia (+61)</option>
            <option value="+43">Austria (+43)</option>
            <option value="+994">Azerbaijan (+994)</option>
            <option value="+1">Bahamas (+1)</option>
            <option value="+973">Bahrain (+973)</option>
            <option value="+880">Bangladesh (+880)</option>
            <option value="+1">Barbados (+1)</option>
            <option value="+375">Belarus (+375)</option>
            <option value="+32">Belgium (+32)</option>
            <option value="+501">Belize (+501)</option>
            <option value="+229">Benin (+229)</option>
            <option value="+1">Bermuda (+1)</option>
            <option value="+975">Bhutan (+975)</option>
            <option value="+591">Bolivia (+591)</option>
            <option value="+387">Bosnia and Herzegovina (+387)</option>
            <option value="+267">Botswana (+267)</option>
            <option value="+55">Brazil (+55)</option>
            <option value="+246">British Indian Ocean Territory (+246)</option>
            <option value="+1">British Virgin Islands (+1)</option>
            <option value="+673">Brunei (+673)</option>
            <option value="+359">Bulgaria (+359)</option>
            <option value="+226">Burkina Faso (+226)</option>
            <option value="+257">Burundi (+257)</option>
            <option value="+855">Cambodia (+855)</option>
            <option value="+237">Cameroon (+237)</option>
            <option value="+1">Canada (+1)</option>
            <option value="+238">Cape Verde (+238)</option>
            <option value="+1">Cayman Islands (+1)</option>
            <option value="+236">Central African Republic (+236)</option>
            <option value="+235">Chad (+235)</option>
            <option value="+56">Chile (+56)</option>
            <option value="+86">China (+86)</option>
            <option value="+886">China - Taiwan (+886)</option>
            <option value="+61">Christmas Island (+61)</option>
            <option value="+672">Cocos Islands (+672)</option>
            <option value="+57">Colombia (+57)</option>
            <option value="+269">Comoros (+269)</option>
            <option value="+242">Congo (+242)</option>
            <option value="+243">Congo - Democratic Republic (+243)</option>
            <option value="+682">Cook Islands (+682)</option>
            <option value="+506">Costa Rica (+506)</option>
            <option value="+225">Côte d'Ivoire (+225)</option>
            <option value="+385">Croatia (+385)</option>
            <option value="+53">Cuba (+53)</option>
            <option value="+357">Cyprus (+357)</option>
            <option value="+420">Czech Republic (+420)</option>
            <option value="+45">Denmark (+45)</option>
            <option value="+246">Diego Garcia (+246)</option>
            <option value="+253">Djibouti (+253)</option>
            <option value="+1">Dominica (+1)</option>
            <option value="+1">Dominican Republic (+1)</option>
            <option value="+593">Ecuador (+593)</option>
            <option value="+20">Egypt (+20)</option>
            <option value="+503">El Salvador (+503)</option>
            <option value="+240">Equatorial Guinea (+240)</option>
            <option value="+291">Eritrea (+291)</option>
            <option value="+372">Estonia (+372)</option>
            <option value="+251">Ethiopia (+251)</option>
            <option value="+500">Falkland Islands (+500)</option>
            <option value="+298">Faroe Islands (+298)</option>
            <option value="+679">Fiji (+679)</option>
            <option value="+358">Finland (+358)</option>
            <option value="+33">France (+33)</option>
            <option value="+594">French Guiana (+594)</option>
            <option value="+689">French Polynesia (+689)</option>
            <option value="+262">French Reunion (+262)</option>
            <option value="+241">Gabon (+241)</option>
            <option value="+220">Gambia (+220)</option>
            <option value="+995">Georgia (+995)</option>
            <option value="+49">Germany (+49)</option>
            <option value="+233">Ghana (+233)</option>
            <option value="+350">Gibraltar (+350)</option>
            <option value="+30">Greece (+30)</option>
            <option value="+299">Greenland (+299)</option>
            <option value="+1">Grenada (+1)</option>
            <option value="+590">Guadeloupe (+590)</option>
            <option value="+1">Guam (+1)</option>
            <option value="+502">Guatemala (+502)</option>
            <option value="+44">Guernsey (+44)</option>
            <option value="+224">Guinea (+224)</option>
            <option value="+245">Guinea-Bissau (+245)</option>
            <option value="+592">Guyana (+592)</option>
            <option value="+509">Haiti (+509)</option>
            <option value="+504">Honduras (+504)</option>
            <option value="+852">Hong Kong (+852)</option>
            <option value="+36">Hungary (+36)</option>
            <option value="+354">Iceland (+354)</option>
            <option value="+91">India (+91)</option>
            <option value="+62">Indonesia (+62)</option>
            <option value="+98">Iran (+98)</option>
            <option value="+964">Iraq (+964)</option>
            <option value="+353">Ireland (+353)</option>
            <option value="+44">Isle of Man (+44)</option>
            <option value="+972">Israel (+972)</option>
            <option value="+39">Italy (+39)</option>
            <option value="+1">Jamaica (+1)</option>
            <option value="+81">Japan (+81)</option>
            <option value="+44">Jersey (+44)</option>
            <option value="+962">Jordan (+962)</option>
            <option value="+7">Kazakhstan (+7)</option>
            <option value="+254">Kenya (+254)</option>
            <option value="+686">Kiribati (+686)</option>
            <option value="+850">Korea - North (+850)</option>
            <option value="+82">Korea - South (+82)</option>
            <option value="+965">Kuwait (+965)</option>
            <option value="+996">Kyrgyzstan (+996)</option>
            <option value="+856">Laos (+856)</option>
            <option value="+371">Latvia (+371)</option>
            <option value="+961">Lebanon (+961)</option>
            <option value="+266">Lesotho (+266)</option>
            <option value="+231">Liberia (+231)</option>
            <option value="+218">Libya (+218)</option>
            <option value="+423">Liechtenstein (+423)</option>
            <option value="+370">Lithuania (+370)</option>
            <option value="+352">Luxembourg (+352)</option>
            <option value="+853">Macau (+853)</option>
            <option value="+389">Macedonia (+389)</option>
            <option value="+261">Madagascar (+261)</option>
            <option value="+265">Malawi (+265)</option>
            <option value="+60">Malaysia (+60)</option>
            <option value="+960">Maldives (+960)</option>
            <option value="+223">Mali (+223)</option>
            <option value="+356">Malta (+356)</option>
            <option value="+692">Marshall Islands (+692)</option>
            <option value="+596">Martinique (+596)</option>
            <option value="+222">Mauritania (+222)</option>
            <option value="+230">Mauritius (+230)</option>
            <option value="+262">Mayotte (+262)</option>
            <option value="+52">Mexico (+52)</option>
            <option value="+691">Micronesia (+691)</option>
            <option value="+373">Moldova (+373)</option>
            <option value="+377">Monaco (+377)</option>
            <option value="+976">Mongolia (+976)</option>
            <option value="+382">Montenegro (+382)</option>
            <option value="+1">Montserrat (+1)</option>
            <option value="+212">Morocco (+212)</option>
            <option value="+258">Mozambique (+258)</option>
            <option value="+95">Myanmar (+95)</option>
            <option value="+264">Namibia (+264)</option>
            <option value="+674">Nauru (+674)</option>
            <option value="+977">Nepal (+977)</option>
            <option value="+31">Netherlands (+31)</option>
            <option value="+599">Netherlands Antilles (+599)</option>
            <option value="+687">New Caledonia (+687)</option>
            <option value="+64">New Zealand (+64)</option>
            <option value="+505">Nicaragua (+505)</option>
            <option value="+227">Niger (+227)</option>
            <option value="+234">Nigeria (+234)</option>
            <option value="+683">Niue (+683)</option>
            <option value="+672">Norfolk Island (+672)</option>
            <option value="+1">Northern Mariana Islands (+1)</option>
            <option value="+47">Norway (+47)</option>
            <option value="+968">Oman (+968)</option>
            <option value="+92">Pakistan (+92)</option>
            <option value="+680">Palau (+680)</option>
            <option value="+507">Panama (+507)</option>
            <option value="+675">Papua New Guinea (+675)</option>
            <option value="+595">Paraguay (+595)</option>
            <option value="+51">Peru (+51)</option>
            <option value="+63">Philippines (+63)</option>
            <option value="+64">Pitcairn Islands (+64)</option>
            <option value="+48">Poland (+48)</option>
            <option value="+351">Portugal (+351)</option>
            <option value="+1">Puerto Rico (+1)</option>
            <option value="+974">Qatar (+974)</option>
            <option value="+262">Réunion (+262)</option>
            <option value="+40">Romania (+40)</option>
            <option value="+7">Russia (+7)</option>
            <option value="+250">Rwanda (+250)</option>
            <option value="+290">Saint Helena (+290)</option>
            <option value="+1">Saint Kitts and Nevis (+1)</option>
            <option value="+1">Saint Lucia (+1)</option>
            <option value="+508">Saint Pierre and Miquelon (+508)</option>
            <option value="+1">Saint Vincent and the Grenadines (+1)</option>
            <option value="+685">Samoa (+685)</option>
            <option value="+378">San Marino (+378)</option>
            <option value="+239">São Tomé and Príncipe (+239)</option>
            <option value="+966">Saudi Arabia (+966)</option>
            <option value="+221">Senegal (+221)</option>
            <option value="+381">Serbia (+381)</option>
            <option value="+248">Seychelles (+248)</option>
            <option value="+232">Sierra Leone (+232)</option>
            <option value="+65">Singapore (+65)</option>
            <option value="+421">Slovakia (+421)</option>
            <option value="+386">Slovenia (+386)</option>
            <option value="+677">Solomon Islands (+677)</option>
            <option value="+252">Somalia (+252)</option>
            <option value="+27">South Africa (+27)</option>
            <option value="+34">Spain (+34)</option>
            <option value="+94">Sri Lanka (+94)</option>
            <option value="+249">Sudan (+249)</option>
            <option value="+597">Suriname (+597)</option>
            <option value="+47">Svalbard and Jan Mayen (+47)</option>
            <option value="+268">Swaziland (+268)</option>
            <option value="+46">Sweden (+46)</option>
            <option value="+41">Switzerland (+41)</option>
            <option value="+963">Syria (+963)</option>
            <option value="+886">Taiwan (+886)</option>
            <option value="+992">Tajikistan (+992)</option>
            <option value="+255">Tanzania (+255)</option>
            <option value="+66">Thailand (+66)</option>
            <option value="+670">Timor-Leste (+670)</option>
            <option value="+228">Togo (+228)</option>
            <option value="+690">Tokelau (+690)</option>
            <option value="+676">Tonga (+676)</option>
            <option value="+1">Trinidad and Tobago (+1)</option>
            <option value="+216">Tunisia (+216)</option>
            <option value="+90">Turkey (+90)</option>
            <option value="+993">Turkmenistan (+993)</option>
            <option value="+1">Turks and Caicos Islands (+1)</option>
            <option value="+688">Tuvalu (+688)</option>
            <option value="+256">Uganda (+256)</option>
            <option value="+380">Ukraine (+380)</option>
            <option value="+971">United Arab Emirates (+971)</option>
            <option value="+44">United Kingdom (+44)</option>
            <option value="+1">United States (+1)</option>
            <option value="+598">Uruguay (+598)</option>
            <option value="+998">Uzbekistan (+998)</option>
            <option value="+678">Vanuatu (+678)</option>
            <option value="+39">Vatican (+39)</option>
            <option value="+58">Venezuela (+58)</option>
            <option value="+84">Vietnam (+84)</option>
            <option value="+1">Virgin Islands (+1)</option>
            <option value="+681">Wallis and Futuna (+681)</option>
            <option value="+212">Western Sahara (+212)</option>
            <option value="+967">Yemen (+967)</option>
            <option value="+260">Zambia (+260)</option>
            <option value="+263">Zimbabwe (+263)</option>
          </select>
          <input
            type="tel"
            placeholder="Phone number"
            value={form.contact || ""}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            className="block flex-1 rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Select country code and enter phone number</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={isGeneratingDescription || !form.title}
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {isGeneratingDescription ? (
              <>
                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <span>✨</span>
                Generate with AI
              </>
            )}
          </button>
        </div>
        <textarea
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image (optional)</label>
        <div className="flex flex-col gap-2">
          {/* Display existing image when editing */}
          {initial?.image && !imageFile && (
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
              <Image
                src={buildAbsoluteUrl(DJANGO_API, initial.image)}
                alt="Current listing image"
                fill
                className="object-cover"
                sizes="100%"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Display new file preview */}
          {imageFile && (
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-green-300">
              <Image
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                fill
                className="object-cover"
                sizes="100%"
              />
            </div>
          )}

          {/* Upload button */}
          <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#dc143c] hover:bg-red-50 transition cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            <span className="text-lg">📷</span>
            <span className="ml-2 text-gray-700 font-medium">
              {imageFile ? imageFile.name : (initial?.image ? 'Click to change image' : 'Click to add image')}
            </span>
          </label>

          {/* Selected file confirmation */}
          {imageFile && (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
              <span className="text-sm text-green-800">✓ Image selected: {imageFile.name}</span>
              <button
                type="button"
                onClick={() => setImageFile(null)}
                className="text-red-600 hover:text-red-800 font-bold text-sm"
              >
                Remove
              </button>
            </div>
          )}

          {/* Clear existing image option */}
          {initial?.image && !imageFile && (
            <button
              type="button"
              onClick={() => {
                // Mark the form to remove the image by setting a flag
                setForm({ ...form, image: null });
              }}
              className="text-xs text-red-600 hover:text-red-800 text-left"
            >
              Remove current image
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-[#dc143c] text-white rounded disabled:opacity-50"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function DashboardMarketplace() {
  const { user, accessToken } = useAuth();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MarketplaceItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all items through Next.js proxy
      const res = await fetch(`/api/marketplace`);
      if (!res.ok) throw new Error('Failed to fetch items');
      const data = await res.json();
      // Filter to only show user's own listings
      const userItems = data.filter((item: any) => item.owner?.email === user?.email) || [];
      setItems(userItems);
    } catch (err) {
      console.error('Error fetching marketplace items', err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function handleSave(data: Partial<MarketplaceItem> | FormData) {
    try {
      // Get auth token from localStorage - it's stored as accessToken
      const token = accessToken;
      
      const buildHeaders = (isForm: boolean) => {
        const headers: Record<string, string> = {};
        if (!isForm) {
          headers['Content-Type'] = 'application/json';
        }
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
      };

      if (editing) {
        // update
        const isForm = data instanceof FormData;
        if (isForm) {
          console.log('Sending FormData for update:', Array.from((data as FormData).entries()));
        } else {
          console.log('Sending JSON for update:', data);
        }
        
        const res = await fetch(`/api/marketplace/${editing.id}/`, {
          method: 'PATCH',
          headers: buildHeaders(isForm),
          body: isForm ? (data as FormData) : JSON.stringify(data),
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => null);
          console.error('Marketplace update failed', res.status, errBody);
          throw new Error(errBody?.error || errBody?.detail || 'Failed to update');
        }
        console.log('Update successful');
      } else {
        const isForm = data instanceof FormData;
        if (isForm) {
          console.log('Sending FormData for create:', Array.from((data as FormData).entries()));
        } else {
          console.log('Sending JSON for create:', data);
        }
        
        const res = await fetch(`/api/marketplace`, {
          method: 'POST',
          headers: buildHeaders(isForm),
          body: isForm ? (data as FormData) : JSON.stringify(data),
        });

        const errBody = await res.json().catch(() => null);
        if (!res.ok) {
          const errorMessage = errBody?.error || errBody?.detail || 'Failed to create';
          console.error('Marketplace create failed', res.status, errBody);
          if (res.status === 401) {
            alert('Please log in again and retry. Your session may have expired.');
            return;
          }
          throw new Error(errorMessage);
        }
        console.log('Create successful');
      }

      setShowForm(false);
      setEditing(null);
      await fetchItems();
    } catch (err) {
      console.error('Save error', err);
      alert(`Failed to save item: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this listing?')) return;
    try {
      const token = accessToken;
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch(`/api/marketplace/${id}/`, { 
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchItems();
    } catch (err) {
      console.error('Delete error', err);
      alert('Failed to delete');
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-serif text-[#dc143c]">My Marketplace Listings</h1>
        <div>
          <button onClick={() => { setShowForm(true); setEditing(null); }} className="px-4 py-2 bg-[#dc143c] text-white rounded">Create Listing</button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded shadow-sm">
          <h2 className="text-xl mb-4">{editing ? 'Edit Listing' : 'Create Listing'}</h2>
          <MarketplaceForm initial={editing || undefined} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
        </div>
      )}

      <div>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : items.length === 0 ? (
          <p className="text-gray-500">You have no listings yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded shadow-sm border overflow-hidden">
                {item.image && (
                  <div className="w-full h-48 bg-gray-200 overflow-hidden relative">
                    <Image
                      src={buildAbsoluteUrl(DJANGO_API, item.image)}
                      alt={item.title || 'Marketplace item'}
                      className="w-full h-full object-cover"
                      fill
                      onError={() => {
                        console.error('Failed to load image:', item.image);
                      }}
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-sm text-[#dc143c]">{item.type}</div>
                      <h3 className="text-lg font-medium">{item.title}</h3>
                      {item.price && <div className="text-gray-700 font-semibold">{item.price}</div>}
                      {item.contact && item.countryCode && (
                        <a
                          href={`https://wa.me/${item.countryCode.replace(/\D/g, '')}${item.contact.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
                        >
                          💬 WhatsApp: {item.countryCode} {item.contact}
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => { setEditing(item); setShowForm(true); }} className="px-3 py-1 border rounded">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                    </div>
                  </div>
                  {item.description && <p className="mt-3 text-gray-600">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
