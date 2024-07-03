import { HomeServices } from '../interfaces/home-services.interface';
import { environment } from '../../environments/environment';

const prefixUrl: string = `${environment.assets.prefix}/img/`;

export const HOME_SERVICES: Array<HomeServices> = [
  {
    id: 1,
    serviceImageUrl: prefixUrl + 'serviceBridalMakeup.jpeg',
    title: 'HOME.SECTION_THREE.SERVICE_BRIDAL_MAKEUP',
  },
  {
    id: 2,
    serviceImageUrl: prefixUrl + 'serviceMicroblading.png',
    title: 'HOME.SECTION_THREE.SERVICE_MICRO_BLADING',
  },
  {
    id: 3,
    serviceImageUrl: prefixUrl + 'serviceSpecialOccasion.jpeg',
    title: 'HOME.SECTION_THREE.SERVICE_SPECIAL_OCCASION_MAKEUP',
  },
  {
    id: 4,
    serviceImageUrl: prefixUrl + 'serviceMakeupLessons.jpeg',
    title: 'HOME.SECTION_THREE.SERVICE_MAKEUP_LESSONS',
  },
  {
    id: 5,
    serviceImageUrl: prefixUrl + 'servicesMoreToDiscover.jpeg',
    title: 'HOME.SECTION_THREE.SERVICES_MANY_MORE',
  },
];
