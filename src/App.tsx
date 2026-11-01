import { CardRow } from './components/CardRow/CardRow';
import { Checkbox } from './components/Checkbox/Checkbox';
import { MarginNote } from './components/MarginNote/MarginNote';
import { NumberField } from './components/NumberField/NumberField';
import { Page } from './components/Page/Page';
import { ReadOnlyValue } from './components/ReadOnlyValue/ReadOnlyValue';
import { ResultCard } from './components/ResultCard/ResultCard';
import { Section } from './components/Section/Section';
import { Slider } from './components/Slider/Slider';
import { Summary } from './components/Summary/Summary';
import { useTripCost } from './core/trip-cost/useTripCost';

export const App = () => {
  const trip = useTripCost();
  const { text, gasolineCar, electricCar, results, breakEven } = trip;

  return (
    <Page title={text.title}>
      <Section heading={text.tripHeading}>
        <NumberField
          id="distance"
          label={text.distanceLabel}
          value={trip.distance}
          unit={text.distanceUnit}
          error={trip.distanceError}
          onChange={trip.onDistanceChange}
          onBlur={trip.onDistanceBlur}
        />
        <Checkbox
          id="round-trip"
          label={text.roundTripLabel}
          checked={trip.roundTrip}
          onChange={trip.onRoundTripChange}
        />
      </Section>

      <Section heading={text.pricesHeading}>
        <Slider
          id="gasoline-price"
          label={text.gasolinePriceLabel}
          value={trip.gasolinePrice.value}
          min={trip.gasolinePrice.min}
          max={trip.gasolinePrice.max}
          step={trip.gasolinePrice.step}
          displayValue={trip.gasolinePrice.display}
          onChange={trip.onGasolinePriceChange}
        />
        <Slider
          id="electricity-price"
          label={text.electricityPriceLabel}
          value={trip.electricityPrice.value}
          min={trip.electricityPrice.min}
          max={trip.electricityPrice.max}
          step={trip.electricityPrice.step}
          displayValue={trip.electricityPrice.display}
          onChange={trip.onElectricityPriceChange}
        />
      </Section>

      <Section heading={text.carsHeading}>
        {gasolineCar.consumptionText && (
          <ReadOnlyValue label={gasolineCar.name} detail={gasolineCar.detail} value={gasolineCar.consumptionText} />
        )}
        {electricCar.consumptionText && (
          <ReadOnlyValue label={electricCar.name} detail={electricCar.detail} value={electricCar.consumptionText} />
        )}
        {electricCar.consumptionSlider && (
          <Slider
            id="electric-consumption"
            label={electricCar.name}
            hint={electricCar.detail}
            value={electricCar.consumptionSlider.value}
            min={electricCar.consumptionSlider.min}
            max={electricCar.consumptionSlider.max}
            step={electricCar.consumptionSlider.step}
            displayValue={electricCar.consumptionSlider.display}
            onChange={trip.onElectricConsumptionChange}
          />
        )}
      </Section>

      {results && (
        <Section heading={text.resultsHeading}>
          <CardRow>
            <ResultCard {...results.gasoline} />
            <ResultCard {...results.electric} />
          </CardRow>
          <Summary text={results.summary} />
        </Section>
      )}

      {breakEven && (
        <Section heading={text.breakEvenHeading}>
          {breakEven.map((note) => (
            <MarginNote key={note} text={note} />
          ))}
        </Section>
      )}
    </Page>
  );
};
