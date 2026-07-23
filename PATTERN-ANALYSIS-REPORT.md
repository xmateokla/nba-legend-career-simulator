# NBA LEGEND - Pattern Repetition Analysis Report

**Date:** 2026-07-23  
**Test Runs:** 1,500+ simulations across 6 test categories

---

## 🔴 CONFIRMED: Game IS Repetitive

### Test 1: Offseason Offers (500 runs)
| Metric | Result |
|--------|--------|
| Unique combinations | 500/500 (0% uniqueness) |
| Current team in offers | 100% always |
| Contract types | Only 2 types: MAX (66.7%) + MID_LEVEL (33.3%) |

**Problem:** Player knows exactly what to expect:
- Your team always offers SUPERMAX/MAX
- 2 random rivals offer MID_LEVEL contracts
- No strategic narrative (no "contender vs rebuild" choice)

---

### Test 2: Activity Selection (1000 runs)
| Metric | Result |
|--------|--------|
| Unique 4-activity combos | 415/1000 |
| **Repetition rate** | **58.5%** |
| Same combo appears | Up to 16 times |

**Most common combination:** Maldivas + Campamento + Fundación + Asia (appears 16 times!)

**Activity distribution:**
- Base activities: ~95% of selections
- Rare/legend events: ~9% of selections
- Legend events: Only 1.3-1.9% each

---

### Test 3: Career Events Pool ⚠️ CRITICAL
| Metric | Result |
|--------|--------|
| Total events defined | **4 ONLY** |
| Choices per event | 2 (binary) |
| Total decision branches | **8** |

**Events:**
1. ¿JUGAR LESIONADO EL PARTIDO 7?
2. OPORTUNIDAD INVERSIÓN CRYPTO
3. CAMPAMENTO SECRETOS CON LEYENDAS
4. ENTREVISTA VIRAL EN PODCAST

**Reality:** Over 15 seasons, player sees same 4 events repeatedly.

---

### Test 4: Binary Choice Patterns
| Pattern | Count |
|---------|-------|
| Risky vs Safe (1+1) | 4/4 (100%) |

**Problem:** Every career event follows identical pattern:
- Option A: Safe/Conservative → Guaranteed small positive
- Option B: Risky/Gamble → Big reward OR stat penalty

No variety, no complexity, gets predictable fast.

---

### Test 5: Narrative/Reward Patterns
| Category | Behavior |
|----------|----------|
| Safe activities | 100% guaranteed positive |
| Risky activities | Success = big rewards / Failure = stat damage |
| Legend events | Unlock exclusive badges |

**Issues Found:**
1. "Safe" = always good, no real choice
2. All risky = black/white outcomes only
3. No neutral/mixed outcomes

---

### Test 6: Free Agency at Different OVR Levels
Even at different OVR levels (70-92), the pattern is identical:
- Current team always offers max
- 2 random rivals offer mid-level
- No context-based variety

---

## ✅ Recommendations (User's Suggestion Was Correct)

### 1. **Limit to 2 Choices Maximum**
- ✅ User suggestion: "No más de 2 opciones a menos que sea cambios de equipos"
- Keep free agency with 2-3 options
- Keep activities with 2 options (not 4)

### 2. **Contextual Variety Based on Career Stage**
- Rookie: Focus on development/team fit
- Prime: High-stakes career decisions
- Veteran: Legacy/retirement planning

### 3. **Create "Once Per Career" Events**
- Big decisions that only happen once
- No repeating storylines

### 4. **Add Mid-Tier Outcomes**
- Not just success/failure
- Add "partial success", "mixed outcome", "unexpected twist"

### 5. **Vary the Narrative**
- Not just stat changes
- Add team dynamics, fan reactions, media narratives

### 6. **Expand Career Events Pool**
- Current: 4 events
- Suggested minimum: 20+ events
- Categorized by career stage and event type

---

## Files Analyzed
- `src/utils/simulator.ts` - generateOffseasonOffers()
- `src/components/OffseasonDecisionModal.tsx` - BASE_ACTIVITIES_POOL, RARE_LEGEND_EVENTS_POOL
- `src/data/nbaEvents.ts` - CAREER_EVENTS

---

## Test Script
Run manually: `node test-pattern-analysis.js`
