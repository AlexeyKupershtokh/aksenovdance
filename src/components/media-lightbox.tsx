import Lightbox, {
	type LightboxExternalProps,
} from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export default function MediaLightbox({
	single,
	...props
}: LightboxExternalProps & { single: boolean }) {
	return (
		<Lightbox
			plugins={single ? [Zoom] : [Thumbnails, Zoom]}
			carousel={{ finite: true, preload: single ? 0 : 5 }}
			render={
				single ? { buttonPrev: () => null, buttonNext: () => null } : undefined
			}
			labels={{
				Slide: "Фотография",
				Carousel: "Галерея",
				"{index} of {total}": "Фото {index} из {total}",
				Lightbox: single ? "Просмотр постера" : "Фотографии сборов",
				"Photo gallery": "Фотографии сборов",
				Thumbnails: "Миниатюры фотографий",
				Close: "Закрыть",
				Previous: "Предыдущее фото",
				Next: "Следующее фото",
				"Zoom in": "Увеличить",
				"Zoom out": "Уменьшить",
				"Show thumbnails": "Показать миниатюры",
				"Hide thumbnails": "Скрыть миниатюры",
			}}
			{...props}
		/>
	);
}
