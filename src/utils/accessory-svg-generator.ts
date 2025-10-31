/**
 * Accessory SVG Generator
 *
 * Generates SVG elements for accessories that can be integrated
 * directly into monster SVG files for perfect animation synchronization.
 *
 * Architecture:
 * - Pure functions (no side effects)
 * - Returns SVG string fragments
 * - Uses viewBox coordinate system (32x32)
 *
 * @module utils/accessory-svg-generator
 */

/**
 * Get SVG markup for an accessory
 *
 * Returns simplified SVG shapes for accessories that can be integrated
 * directly into the monster SVG. Coordinates are in the 32x32 viewBox system.
 *
 * @param accessoryId - Unique identifier of the accessory
 * @param category - Category (hat, glasses, shoes)
 * @returns SVG markup as string
 */
export function getAccessorySVG (accessoryId: string, category: string): string {
  // Hat accessories
  if (category === 'hat') {
    if (accessoryId.includes('crown')) {
      return `
        <g class="accessory-hat">
          <!-- Crown base -->
          <rect x="10" y="-3" width="12" height="2" fill="#ffd9b5"/>
          <!-- Crown peaks -->
          <rect x="10" y="-5" width="2" height="2" fill="#ffd9b5"/>
          <rect x="13.5" y="-6" width="2" height="3" fill="#ffd9b5"/>
          <rect x="15" y="-7" width="2" height="4" fill="#ffd9b5"/>
          <rect x="17" y="-6" width="2" height="3" fill="#ffd9b5"/>
          <rect x="20" y="-5" width="2" height="2" fill="#ffd9b5"/>
        </g>
      `
    }
    if (accessoryId.includes('wizard')) {
      return `
        <g class="accessory-hat">
          <!-- Wizard hat cone -->
          <polygon points="16,-8 11,0 21,0" fill="#d9b5ff"/>
          <!-- Hat brim -->
          <ellipse cx="16" cy="0" rx="6" ry="1.5" fill="#d9b5ff"/>
          <!-- Star decoration -->
          <circle cx="16" cy="-4" r="0.8" fill="#fff9b5"/>
        </g>
      `
    }
    if (accessoryId.includes('cowboy')) {
      return `
        <g class="accessory-hat">
          <!-- Hat crown -->
          <rect x="13" y="-4" width="6" height="3" fill="#c97a5f"/>
          <!-- Wide brim -->
          <ellipse cx="16" cy="-1" rx="8" ry="1.5" fill="#c97a5f"/>
        </g>
      `
    }
    if (accessoryId.includes('cap')) {
      return `
        <g class="accessory-hat">
          <!-- Cap dome -->
          <ellipse cx="16" cy="-1" rx="5" ry="3" fill="#b5d9ff"/>
          <!-- Visor -->
          <ellipse cx="16" cy="0" rx="6" ry="1.5" fill="#8cb8e8"/>
        </g>
      `
    }
    if (accessoryId.includes('party')) {
      return `
        <g class="accessory-hat">
          <!-- Party hat cone -->
          <polygon points="16,-10 12,0 20,0" fill="#ffb5d9"/>
          <!-- Polka dots -->
          <circle cx="14" cy="-3" r="0.5" fill="#fff"/>
          <circle cx="16" cy="-6" r="0.5" fill="#fff"/>
          <circle cx="18" cy="-4" r="0.5" fill="#fff"/>
          <!-- Pom pom -->
          <circle cx="16" cy="-10" r="1" fill="#ffd9b5"/>
        </g>
      `
    }
    if (accessoryId.includes('beret')) {
      return `
        <g class="accessory-hat">
          <!-- Beret top -->
          <ellipse cx="16" cy="-2" rx="6" ry="2.5" fill="#ff8585"/>
          <!-- Beret base -->
          <rect x="13" y="-0.5" width="6" height="1" fill="#d96565"/>
        </g>
      `
    }
  }

  // Glasses accessories
  if (category === 'glasses') {
    if (accessoryId.includes('sun')) {
      return `
        <g class="accessory-glasses">
          <!-- Left lens -->
          <rect x="12" y="0" width="3" height="2" rx="0.5" fill="#6b5643" opacity="0.8"/>
          <!-- Right lens -->
          <rect x="17" y="0" width="3" height="2" rx="0.5" fill="#6b5643" opacity="0.8"/>
          <!-- Bridge -->
          <rect x="15" y="0.5" width="2" height="0.8" fill="#6b5643"/>
        </g>
      `
    }
    if (accessoryId.includes('nerd')) {
      return `
        <g class="accessory-glasses">
          <!-- Left frame -->
          <rect x="12" y="0" width="3" height="2.5" rx="0.3" fill="none" stroke="#c97a5f" stroke-width="0.4"/>
          <!-- Right frame -->
          <rect x="17" y="0" width="3" height="2.5" rx="0.3" fill="none" stroke="#c97a5f" stroke-width="0.4"/>
          <!-- Bridge -->
          <line x1="15" y1="1.2" x2="17" y2="1.2" stroke="#c97a5f" stroke-width="0.4"/>
        </g>
      `
    }
    if (accessoryId.includes('heart')) {
      return `
        <g class="accessory-glasses">
          <!-- Left heart lens -->
          <path d="M 13.5,0.5 Q 12,0.5 12,1.8 Q 12,3 13.5,3.5 Q 15,3 15,1.8 Q 15,0.5 13.5,0.5" fill="#ffd9e8"/>
          <!-- Right heart lens -->
          <path d="M 18.5,0.5 Q 17,0.5 17,1.8 Q 17,3 18.5,3.5 Q 20,3 20,1.8 Q 20,0.5 18.5,0.5" fill="#ffd9e8"/>
        </g>
      `
    }
    if (accessoryId.includes('monocle')) {
      return `
        <g class="accessory-glasses">
          <!-- Monocle frame -->
          <circle cx="18" cy="1.5" r="2" fill="none" stroke="#fff9b5" stroke-width="0.4"/>
          <!-- Chain -->
          <path d="M 18,3.5 Q 18,5 16,5.5" stroke="#fff9b5" stroke-width="0.3" fill="none"/>
        </g>
      `
    }
    if (accessoryId.includes('3d')) {
      return `
        <g class="accessory-glasses">
          <!-- Left lens (cyan) -->
          <rect x="12" y="0" width="3" height="2" fill="#00ffff" opacity="0.5"/>
          <!-- Right lens (red) -->
          <rect x="17" y="0" width="3" height="2" fill="#ff0000" opacity="0.5"/>
          <!-- Bridge -->
          <rect x="15" y="0.8" width="2" height="0.5" fill="#333"/>
        </g>
      `
    }
  }

  // Shoes accessories
  if (category === 'shoes') {
    if (accessoryId.includes('sneakers')) {
      return `
        <g class="accessory-shoes">
          <!-- Left shoe -->
          <ellipse cx="13" cy="0" rx="2.5" ry="1.5" fill="#ffa5a5"/>
          <ellipse cx="13" cy="0" rx="1.5" ry="0.8" fill="#ffffff"/>
          <line x1="12" y1="-0.8" x2="12" y2="0.8" stroke="#fff" stroke-width="0.3"/>
          <!-- Right shoe -->
          <ellipse cx="19" cy="0" rx="2.5" ry="1.5" fill="#ffa5a5"/>
          <ellipse cx="19" cy="0" rx="1.5" ry="0.8" fill="#ffffff"/>
          <line x1="18" y1="-0.8" x2="18" y2="0.8" stroke="#fff" stroke-width="0.3"/>
        </g>
      `
    }
    if (accessoryId.includes('boots')) {
      return `
        <g class="accessory-shoes">
          <!-- Left boot -->
          <rect x="11.5" y="-2" width="3" height="2.5" rx="0.3" fill="#b39b7f"/>
          <rect x="11.5" y="0.5" width="3" height="0.5" fill="#8b7355"/>
          <!-- Right boot -->
          <rect x="17.5" y="-2" width="3" height="2.5" rx="0.3" fill="#b39b7f"/>
          <rect x="17.5" y="0.5" width="3" height="0.5" fill="#8b7355"/>
        </g>
      `
    }
    if (accessoryId.includes('heels')) {
      return `
        <g class="accessory-shoes">
          <!-- Left heel -->
          <path d="M 12,-0.5 L 14.5,-0.5 L 14.5,-2.5 Q 14.5,-3 14,-3 L 12.5,-2 Q 12,-1.5 12,-0.5 Z" fill="#ff8585"/>
          <rect x="12.5" y="-0.8" width="1.5" height="0.3" fill="#ffffff"/>
          <!-- Right heel -->
          <path d="M 17.5,-0.5 L 20,-0.5 L 20,-2.5 Q 20,-3 19.5,-3 L 18,-2 Q 17.5,-1.5 17.5,-0.5 Z" fill="#ff8585"/>
          <rect x="18" y="-0.8" width="1.5" height="0.3" fill="#ffffff"/>
        </g>
      `
    }
    if (accessoryId.includes('ballet')) {
      return `
        <g class="accessory-shoes">
          <!-- Left ballet slipper -->
          <ellipse cx="13" cy="0" rx="2.5" ry="1.2" fill="#ffd9e8"/>
          <path d="M 11,0 Q 11,-1.5 13,-2" stroke="#ffd9e8" stroke-width="0.5" fill="none"/>
          <!-- Right ballet slipper -->
          <ellipse cx="19" cy="0" rx="2.5" ry="1.2" fill="#ffd9e8"/>
          <path d="M 21,0 Q 21,-1.5 19,-2" stroke="#ffd9e8" stroke-width="0.5" fill="none"/>
        </g>
      `
    }
    if (accessoryId.includes('roller')) {
      return `
        <g class="accessory-shoes">
          <!-- Left roller skate -->
          <rect x="11" y="-1.5" width="4" height="1.5" rx="0.5" fill="#d9b5ff"/>
          <circle cx="12" cy="0.5" r="0.8" fill="#333"/>
          <circle cx="14" cy="0.5" r="0.8" fill="#333"/>
          <!-- Right roller skate -->
          <rect x="17" y="-1.5" width="4" height="1.5" rx="0.5" fill="#d9b5ff"/>
          <circle cx="18" cy="0.5" r="0.8" fill="#333"/>
          <circle cx="20" cy="0.5" r="0.8" fill="#333"/>
        </g>
      `
    }
    if (accessoryId.includes('flip-flops')) {
      return `
        <g class="accessory-shoes">
          <!-- Left flip flop -->
          <ellipse cx="13" cy="0" rx="2" ry="0.8" fill="#ffd9b5"/>
          <path d="M 13,-1 L 13,0" stroke="#c97a5f" stroke-width="0.5"/>
          <!-- Right flip flop -->
          <ellipse cx="19" cy="0" rx="2" ry="0.8" fill="#ffd9b5"/>
          <path d="M 19,-1 L 19,0" stroke="#c97a5f" stroke-width="0.5"/>
        </g>
      `
    }
  }

  // Default: simple placeholder
  return '<circle cx="16" cy="0" r="2" fill="#ff69b4" opacity="0.5"/>'
}
