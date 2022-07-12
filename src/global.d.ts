/// <reference types="@sveltejs/kit" />

import type { Advisor } from '$lib/store/advisor';
import type { Agency } from '$lib/store/agency';
import type { User } from '$lib/store/auth';

declare global {
  declare namespace App {
    interface Locals {
      user?: User;
      travellerMe?: Traveller;
      advisorMe?: Advisor;
      agencyMe?: Agency;
    }

    interface Session {
      user?: User;
      travellerMe?: Traveller;
      advisorMe?: Advisor;
      agencyMe?: Agency;
   }
  }
}
